import React, { useState, useMemo } from 'react'
import { useSaListOrganisationsQuery, useSaCancelSubscriptionMutation, useSaUpdateSubscriptionMutation, useSaListUsersQuery, useSaUpdateUserRoleMutation, useSaUpdateUserStatusMutation } from '../../../slices/superAdminApiSlice'
import { motion, AnimatePresence } from 'framer-motion'

const Badge = ({ children, color }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-poppins ${color}`}>{children}</span>
)

const Card = ({ title, value, sub }) => (
  <div className="glass-card p-5">
    <p className="text-sm text-gray-500 font-lato">{title}</p>
    <div className="mt-2 text-2xl font-poppins font-bold">{value}</div>
    {sub && <p className="mt-1 text-xs text-gray-500 font-lato">{sub}</p>}
  </div>
)

const SuperAdminDashboard = () => {
  const { data: orgsData, isLoading: orgsLoading, refetch: refetchOrgs } = useSaListOrganisationsQuery()
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useSaListUsersQuery()
  const [cancelSubscription, { isLoading: cancelling }] = useSaCancelSubscriptionMutation()
  const [updateSubscription, { isLoading: updatingSub }] = useSaUpdateSubscriptionMutation()
  const [updateUserRole, { isLoading: updatingRole }] = useSaUpdateUserRoleMutation()
  const [updateUserStatus, { isLoading: updatingStatus }] = useSaUpdateUserStatusMutation()

  const [activeTab, setActiveTab] = useState('organisations')
  const [searchOrg, setSearchOrg] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [confirm, setConfirm] = useState({ open: false, orgId: null })

  const organisations = orgsData?.data || []
  const users = usersData?.data || []

  const stats = useMemo(() => {
    const totalOrgs = organisations.length
    const activeOrgs = organisations.filter(o => o.subscriptionStatus === 'active').length
    const inactiveOrgs = organisations.filter(o => o.subscriptionStatus !== 'active').length
    return { totalOrgs, activeOrgs, inactiveOrgs, totalUsers: users.length }
  }, [organisations, users])

  const filteredOrgs = useMemo(() => {
    const q = searchOrg.trim().toLowerCase()
    if (!q) return organisations
    return organisations.filter(o => `${o.name} ${o.subdomain}`.toLowerCase().includes(q))
  }, [organisations, searchOrg])

  const filteredUsers = useMemo(() => {
    const q = searchUser.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => `${u.email} ${u.role}`.toLowerCase().includes(q))
  }, [users, searchUser])

  const statusColor = (s) => {
    switch ((s || '').toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'trial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 font-lato">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-poppins font-bold">Super Admin</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all organisations and users</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{refetchOrgs(); refetchUsers();}} className="glass-button-secondary">Refresh All</button>
              <div className="hidden sm:flex rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-800">
                {['organisations','users'].map(t => (
                  <button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 text-sm font-poppins ${activeTab===t?'bg-indigo-600 text-white':'text-indigo-600 dark:text-indigo-300'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Orgs" value={stats.totalOrgs} />
          <Card title="Active Orgs" value={stats.activeOrgs} />
          <Card title="Inactive Orgs" value={stats.inactiveOrgs} />
          <Card title="Total Users" value={stats.totalUsers} />
        </div>

        {/* Tabs (mobile) */}
        <div className="sm:hidden glass-card p-2 flex gap-2">
          {['organisations','users'].map(t => (
            <button key={t} onClick={()=>setActiveTab(t)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-poppins ${activeTab===t?'bg-indigo-600 text-white':'text-indigo-600 dark:text-indigo-300'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'organisations' ? (
            <motion.div key="orgs" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-poppins font-bold">Organisations</h2>
                <div className="flex gap-2 items-center">
                  <input value={searchOrg} onChange={(e)=>setSearchOrg(e.target.value)} placeholder="Search orgs..." className="glass-input w-full sm:w-64" />
                  <button onClick={()=>refetchOrgs()} className="glass-button-secondary">Reload</button>
                </div>
              </div>
              {orgsLoading ? (
                <div className="py-12 text-center text-sm">Loading organisations...</div>
              ) : filteredOrgs.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">No organisations match your search.</div>
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
                      {filteredOrgs.map((o) => (
                        <tr key={o.id} className="bg-white/50 dark:bg-gray-900/50">
                          <td className="px-4 py-3 text-sm font-lato">{o.name}</td>
                          <td className="px-4 py-3 text-sm font-lato">{o.subdomain}</td>
                          <td className="px-4 py-3 text-sm"><Badge color={statusColor(o.subscriptionStatus)}>{o.subscriptionStatus}</Badge></td>
                          <td className="px-4 py-3 text-sm font-lato">{o.subscriptionEndDate ? new Date(o.subscriptionEndDate).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-3 text-sm flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <div className="flex items-center gap-2">
                              <input type="date" value={newEndDate} onChange={(e)=>setNewEndDate(e.target.value)} className="glass-input w-auto px-2 py-2" />
                              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={updatingSub || !newEndDate} onClick={async ()=>{ await updateSubscription({ id:o.id, body: { subscriptionStatus:'active', subscriptionEndDate: newEndDate }}).unwrap(); setNewEndDate(''); refetchOrgs(); }} className="glass-button">Set Active</motion.button>
                            </div>
                            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={cancelling} onClick={()=>setConfirm({ open:true, orgId:o.id })} className="glass-button-secondary">Cancel</motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="users" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-poppins font-bold">Users</h2>
                <div className="flex gap-2 items-center">
                  <input value={searchUser} onChange={(e)=>setSearchUser(e.target.value)} placeholder="Search users..." className="glass-input w-full sm:w-64" />
                  <button onClick={()=>refetchUsers()} className="glass-button-secondary">Reload</button>
                </div>
              </div>
              {usersLoading ? (
                <div className="py-12 text-center text-sm">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">No users match your search.</div>
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
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="bg-white/50 dark:bg-gray-900/50">
                          <td className="px-4 py-3 text-sm font-lato">{u.email}</td>
                          <td className="px-4 py-3 text-sm font-lato">
                            <select defaultValue={u.role} onChange={async (e)=>{ await updateUserRole({ id:u.id, role:e.target.value }).unwrap(); refetchUsers(); }} className="glass-input w-auto">
                              {['employee','manager','admin','superadmin'].map(r=> (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm font-lato">{u.is_active ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3 text-sm flex flex-wrap gap-2">
                            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={updatingStatus} onClick={async ()=>{ await updateUserStatus({ id:u.id, is_active: !u.is_active}).unwrap(); refetchUsers(); }} className="glass-button-secondary">{u.is_active?'Deactivate':'Activate'}</motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Modal */}
        <AnimatePresence>
          {confirm.open && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="glass-card p-6 w-full max-w-md">
                <h3 className="text-lg font-poppins font-bold mb-2">Cancel subscription?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">This will immediately set the organisation to inactive.</p>
                <div className="flex justify-end gap-2">
                  <button onClick={()=>setConfirm({ open:false, orgId:null })} className="glass-button-secondary">No</button>
                  <button disabled={cancelling} onClick={async ()=>{ await cancelSubscription(confirm.orgId).unwrap(); setConfirm({ open:false, orgId:null }); refetchOrgs(); }} className="glass-button">Yes, cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

