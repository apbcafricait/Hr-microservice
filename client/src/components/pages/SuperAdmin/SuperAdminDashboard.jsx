import React, { useState } from 'react'
import { useSaListOrganisationsQuery, useSaCancelSubscriptionMutation, useSaUpdateSubscriptionMutation, useSaListUsersQuery, useSaUpdateUserRoleMutation, useSaUpdateUserStatusMutation } from '../../../slices/superAdminApiSlice'
import { motion } from 'framer-motion'

const SuperAdminDashboard = () => {
  const { data: orgsData, isLoading: orgsLoading, refetch: refetchOrgs } = useSaListOrganisationsQuery()
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useSaListUsersQuery()
  const [cancelSubscription, { isLoading: cancelling }] = useSaCancelSubscriptionMutation()
  const [updateSubscription, { isLoading: updatingSub }] = useSaUpdateSubscriptionMutation()
  const [updateUserRole, { isLoading: updatingRole }] = useSaUpdateUserRoleMutation()
  const [updateUserStatus, { isLoading: updatingStatus }] = useSaUpdateUserStatusMutation()

  const [newEndDate, setNewEndDate] = useState('')

  const organisations = orgsData?.data || []
  const users = usersData?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 font-lato">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-poppins font-bold">Organisations</h1>
            <button onClick={() => refetchOrgs()} className="glass-button-secondary">Refresh</button>
          </div>
          {orgsLoading ? (
            <div className="py-12 text-center text-sm">Loading organisations...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-indigo-50/50 dark:bg-indigo-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Subdomain</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">End Date</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {organisations.map((o) => (
                    <tr key={o.id} className="bg-white/50 dark:bg-gray-900/50">
                      <td className="px-4 py-3 text-sm">{o.name}</td>
                      <td className="px-4 py-3 text-sm">{o.subdomain}</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-poppins">{o.subscriptionStatus}</span></td>
                      <td className="px-4 py-3 text-sm">{o.subscriptionEndDate ? new Date(o.subscriptionEndDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-sm flex flex-wrap gap-2 items-center">
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={cancelling} onClick={async () => { await cancelSubscription(o.id).unwrap(); refetchOrgs(); }} className="glass-button">Cancel</motion.button>
                        <input type="date" value={newEndDate} onChange={(e)=>setNewEndDate(e.target.value)} className="glass-input w-auto px-2 py-2" />
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={updatingSub || !newEndDate} onClick={async ()=>{ await updateSubscription({ id:o.id, body: { subscriptionStatus:'active', subscriptionEndDate: newEndDate }}).unwrap(); setNewEndDate(''); refetchOrgs(); }} className="glass-button">Set Active</motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-poppins font-bold">Users</h2>
            <button onClick={() => refetchUsers()} className="glass-button-secondary">Refresh</button>
          </div>
          {usersLoading ? (
            <div className="py-12 text-center text-sm">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-indigo-50/50 dark:bg-indigo-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Active</th>
                    <th className="px-4 py-3 text-left text-xs font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {users.map((u) => (
                    <tr key={u.id} className="bg-white/50 dark:bg-gray-900/50">
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm">{u.role}</td>
                      <td className="px-4 py-3 text-sm">{u.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm flex flex-wrap gap-2">
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={updatingRole} onClick={async ()=>{ await updateUserRole({ id:u.id, role: u.role==='admin'?'employee':'admin'}).unwrap(); refetchUsers(); }} className="glass-button-secondary">Toggle Admin</motion.button>
                        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={updatingStatus} onClick={async ()=>{ await updateUserStatus({ id:u.id, is_active: !u.is_active}).unwrap(); refetchUsers(); }} className="glass-button-secondary">{u.is_active?'Deactivate':'Activate'}</motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

