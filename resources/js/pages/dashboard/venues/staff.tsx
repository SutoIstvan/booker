import { useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, User, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

interface Service {
    id: number;
    name: string;
}

interface StaffMember {
    id: number;
    name: string;
    avatar: string | null;
    position: string | null;
    is_active: boolean;
    services?: Service[];
}

interface Venue {
    id: number;
    name: string;
}

interface Props {
    venue: Venue;
    staff: StaffMember[];
    services: Service[];
}

export default function VenueStaff({ venue, staff, services }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    // Form for adding staff
    const addForm = useForm<{
        name: string;
        position: string;
        avatar: File | null;
        is_active: boolean;
        services: number[];
    }>({
        name: '',
        position: '',
        avatar: null,
        is_active: true,
        services: [],
    });

    // Form for editing staff
    const editForm = useForm<{
        name: string;
        position: string;
        avatar: File | null;
        is_active: boolean;
        services: number[];
        _method?: string;
    }>({
        name: '',
        position: '',
        avatar: null,
        is_active: true,
        services: [],
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(`/dashboard/venues/${venue.id}/staff`, {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditClick = (member: StaffMember) => {
        setEditingStaff(member);
        const serviceIds = member.services?.map(s => s.id) || [];
        editForm.setData({
            name: member.name,
            position: member.position || '',
            avatar: null,
            is_active: member.is_active,
            services: serviceIds,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;

        // Note: we use post request with _method: 'PUT' to support file uploads in PHP
        editForm.setData('_method', 'PUT');

        editForm.post(`/dashboard/venues/${venue.id}/staff/${editingStaff.id}`, {
            onSuccess: () => {
                setEditingStaff(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (memberId: number) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            addForm.delete(`/dashboard/venues/${venue.id}/staff/${memberId}`);
        }
    };

    const handleAddServiceToggle = (serviceId: number) => {
        const current = addForm.data.services;
        if (current.includes(serviceId)) {
            addForm.setData('services', current.filter(id => id !== serviceId));
        } else {
            addForm.setData('services', [...current, serviceId]);
        }
    };

    const handleEditServiceToggle = (serviceId: number) => {
        const current = editForm.data.services;
        if (current.includes(serviceId)) {
            editForm.setData('services', current.filter(id => id !== serviceId));
        } else {
            editForm.setData('services', [...current, serviceId]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Staff & Providers</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Manage your specialists, their positions, and assign services to them.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl h-10 px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                </Button>
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800">
                <CardContent className="p-0">
                    {staff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 dark:text-neutral-400">
                            <User className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">No staff members yet</h3>
                            <p className="text-xs max-w-xs mt-1">Add specialists or masters to perform the booking services.</p>
                            <Button onClick={() => setIsAddOpen(true)} variant="outline" className="mt-4 rounded-xl">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Staff
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-neutral-200 dark:border-neutral-800">
                                    <TableHead>Staff Member</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Assigned Services</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.map((member) => (
                                    <TableRow key={member.id} className="border-neutral-200 dark:border-neutral-800">
                                        <TableCell className="font-semibold">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    {member.avatar ? (
                                                        <AvatarImage src={member.avatar} alt={member.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-bold">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-neutral-900 dark:text-neutral-50">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-neutral-600 dark:text-neutral-400">
                                            {member.position || 'General Specialist'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[280px]">
                                                {member.services && member.services.length > 0 ? (
                                                    member.services.map((s) => (
                                                        <span key={s.id} className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                                                            {s.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-neutral-400">No services assigned</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {member.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full h-8 w-8 text-neutral-500"
                                                    onClick={() => handleEditClick(member)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full h-8 w-8 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
                                                    onClick={() => handleDelete(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add Staff Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Create a profile for your therapist, barber or technician.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-staff-name">Name</Label>
                            <Input
                                id="add-staff-name"
                                required
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            <InputError message={addForm.errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-staff-position">Position / Role</Label>
                            <Input
                                id="add-staff-position"
                                value={addForm.data.position}
                                onChange={(e) => addForm.setData('position', e.target.value)}
                                placeholder="e.g. Master Barber, Senior Stylist"
                            />
                            <InputError message={addForm.errors.position} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-staff-avatar">Avatar Photo</Label>
                            <Input
                                id="add-staff-avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => addForm.setData('avatar', e.target.files ? e.target.files[0] : null)}
                                className="cursor-pointer file:mr-2 file:bg-neutral-100 dark:file:bg-neutral-900 file:border-none file:text-xs file:font-semibold rounded-xl"
                            />
                            <InputError message={addForm.errors.avatar} />
                        </div>

                        {/* Services List */}
                        <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                            <Label className="font-semibold text-sm">Assign Services</Label>
                            <span className="text-xs text-neutral-400 block mt-0.5">Which services can this staff member provide?</span>
                            {services.length === 0 ? (
                                <p className="text-xs text-neutral-400">Please add services first.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-2 max-h-[160px] overflow-y-auto border border-neutral-100 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/10">
                                    {services.map((service) => (
                                        <div key={service.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`add-service-${service.id}`}
                                                checked={addForm.data.services.includes(service.id)}
                                                onCheckedChange={() => handleAddServiceToggle(service.id)}
                                            />
                                            <Label htmlFor={`add-service-${service.id}`} className="text-xs font-medium cursor-pointer line-clamp-1">
                                                {service.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <InputError message={addForm.errors.services} />
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Active Status</Label>
                                <span className="text-xs text-neutral-400 block">Make active for client bookings.</span>
                            </div>
                            <Switch
                                checked={addForm.data.is_active}
                                onCheckedChange={(checked) => addForm.setData('is_active', checked)}
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={addForm.processing} className="rounded-xl shimmer-btn bg-neutral-900 dark:bg-white text-white dark:text-black">
                                Add Member
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Staff Dialog */}
            <Dialog open={editingStaff !== null} onOpenChange={(open) => !open && setEditingStaff(null)}>
                <DialogContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Staff Profile</DialogTitle>
                        <DialogDescription>Update staff information, picture and assigned service list.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-staff-name">Name</Label>
                            <Input
                                id="edit-staff-name"
                                required
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-staff-position">Position / Role</Label>
                            <Input
                                id="edit-staff-position"
                                value={editForm.data.position}
                                onChange={(e) => editForm.setData('position', e.target.value)}
                            />
                            <InputError message={editForm.errors.position} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-staff-avatar">Avatar Photo (leave empty to keep current)</Label>
                            <Input
                                id="edit-staff-avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('avatar', e.target.files ? e.target.files[0] : null)}
                                className="cursor-pointer file:mr-2 file:bg-neutral-100 dark:file:bg-neutral-900 file:border-none file:text-xs file:font-semibold rounded-xl"
                            />
                            <InputError message={editForm.errors.avatar} />
                        </div>

                        {/* Services List */}
                        <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                            <Label className="font-semibold text-sm">Assign Services</Label>
                            <span className="text-xs text-neutral-400 block mt-0.5">Which services can this staff member provide?</span>
                            <div className="grid grid-cols-2 gap-3 mt-2 max-h-[160px] overflow-y-auto border border-neutral-100 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/10">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`edit-service-${service.id}`}
                                            checked={editForm.data.services.includes(service.id)}
                                            onCheckedChange={() => handleEditServiceToggle(service.id)}
                                        />
                                        <Label htmlFor={`edit-service-${service.id}`} className="text-xs font-medium cursor-pointer line-clamp-1">
                                            {service.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={editForm.errors.services} />
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Active Status</Label>
                                <span className="text-xs text-neutral-400 block">Make active for client bookings.</span>
                            </div>
                            <Switch
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setEditingStaff(null)} className="rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="rounded-xl shimmer-btn bg-neutral-900 dark:bg-white text-white dark:text-black">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
