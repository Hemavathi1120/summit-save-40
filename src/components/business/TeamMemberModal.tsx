import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Trash2, User, Mail, PhoneCall } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: any) => void;
  member?: any;
}

export function TeamMemberModal({ isOpen, onClose, onSave, member }: TeamMemberModalProps) {
  const [name, setName] = React.useState(member?.name || '');
  const [email, setEmail] = React.useState(member?.email || '');
  const [role, setRole] = React.useState(member?.role || 'Member');
  const [phone, setPhone] = React.useState(member?.phone || '');

  React.useEffect(() => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setRole(member.role || 'Member');
      setPhone(member.phone || '');
    } else {
      setName('');
      setEmail('');
      setRole('Member');
      setPhone('');
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      onSave({
        id: member?.id || Date.now(),
        name,
        email,
        role,
        phone,
        avatar: member?.avatar || '',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-md rounded-xl border-2 border-primary/10 dark:border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-xl font-semibold">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 pb-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <div className="relative">
              <PhoneCall className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 pb-4">
          {member && (
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                onSave({ ...member, deleted: true });
                onClose();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSave}
            className={member ? "" : "w-full"}
          >
            <Save className="mr-2 h-4 w-4" />
            {member ? 'Save Changes' : 'Add Member'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
