'use client';

import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser } from "@/app/actions/user";
import { 
  Users as UsersIcon, 
  UserPlus, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  Search,
  X,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await addUser(formData);
      toast.success("User added successfully");
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    
    try {
      await deleteUser(deleteUserId);
      toast.success("User deleted successfully");
      setDeleteUserId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage administrative and standard user credentials.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary text-primary-foreground glow font-bold rounded-xl h-12 px-6 border-0">
          <UserPlus className="w-5 h-5 mr-2" />
          Register New Account
        </Button>
      </div>

      <Card className="glass-card border-white/5">
        <CardHeader className="pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
                <th className="px-6 py-4 text-left font-bold">User</th>
                <th className="px-6 py-4 text-left font-bold">Role</th>
                <th className="px-6 py-4 text-left font-bold text-center">Generated Files</th>
                <th className="px-6 py-4 text-left font-bold">Joined</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-white/10 flex items-center justify-center text-primary">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={user.role === 'admin' ? "bg-primary/20 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : null}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-primary leading-none">{user.file_count || 0}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mt-1">Links</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        onClick={() => setDeleteUserId(user.id)}
                        className="bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border border-destructive/20 rounded-lg px-3 h-8 text-[11px] font-bold uppercase transition-all flex items-center gap-2 ml-auto"
                        title="Remove User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md glass-card border-primary/20 glow shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Register User</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="rounded-full hover:bg-white/5">
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardDescription className="px-6 mb-4">Create a new account credential.</CardDescription>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="name" placeholder="John Doe" required className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="email" type="email" placeholder="john@example.com" required className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                  <Input name="password" type="password" placeholder="••••••••" required className="h-11 bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest ml-1">System Role</label>
                  <select 
                    name="role" 
                    className="w-full h-11 bg-background border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50 text-white"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl h-12 font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-lg flex-1 border-0">
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-sm glass-card border-destructive/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Are you sure?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-sm">
                This action is permanent. You are about to delete <span className="text-white font-bold underline underline-offset-4 decoration-destructive">{users.find(u => u.id === deleteUserId)?.name}</span> and all associated data.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setDeleteUserId(null)}
                  className="flex-1 rounded-xl h-12 font-bold hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl h-12 shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] border-0"
                >
                  Yes, Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
