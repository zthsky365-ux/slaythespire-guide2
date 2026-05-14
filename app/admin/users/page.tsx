"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  createdAt: string;
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.map((u: UserData & { password?: string }) => ({ id: u.id, email: u.email, name: u.name, role: u.role, status: u.status, createdAt: u.createdAt })));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const method = users.find((u) => u.id === editingUser.id) ? "PUT" : "POST";
      await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingUser, password }),
      });
      setIsDialogOpen(false);
      setEditingUser(null);
      setPassword("");
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("user.deleteConfirm"))) return;

    try {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">{t("user.users")}</h1>
          <p className="text-muted-foreground mt-1">{t("user.userList")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser({ id: "", email: "", name: "", role: "viewer", status: "active", createdAt: new Date().toISOString() });
            setPassword("");
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("user.createUser")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("user.username")}</TableHead>
                <TableHead>{t("user.email")}</TableHead>
                <TableHead>{t("user.role")}</TableHead>
                <TableHead>{t("user.status")}</TableHead>
                <TableHead>{t("article.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("common.loading")}</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{t("home.noArticles")}</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === "admin" ? "bg-purple-500/20 text-purple-400" :
                        user.role === "editor" ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        {t(`user.${user.role}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {t(`user.${user.status}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setPassword(""); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? t("user.editUser") : t("user.createUser")}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("user.username")}</label>
                <Input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("user.email")}</label>
                <Input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
              </div>
              {!editingUser.id && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("auth.password")}</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password")} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("user.role")}</label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value as UserData["role"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("user.admin")}</SelectItem>
                      <SelectItem value="editor">{t("user.editor")}</SelectItem>
                      <SelectItem value="viewer">{t("user.viewer")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{t("user.status")}</label>
                  <Select value={editingUser.status} onValueChange={(value) => setEditingUser({ ...editingUser, status: value as UserData["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("user.active")}</SelectItem>
                      <SelectItem value="inactive">{t("user.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("common.cancel")}</Button>
                <Button onClick={handleSave}>{t("common.save")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
