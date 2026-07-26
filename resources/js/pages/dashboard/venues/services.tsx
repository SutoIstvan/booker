import { useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_active: boolean;
    sort_order: number;
}

interface Venue {
    id: number;
    name: string;
}

interface Props {
    venue: Venue;
    services: Service[];
}

export default function VenueServices({ venue, services }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form for adding service
    const addForm = useForm({
        name: '',
        description: '',
        duration_minutes: 30,
        price: '',
        is_active: true,
    });

    // Form for editing service
    const editForm = useForm({
        name: '',
        description: '',
        duration_minutes: 30,
        price: '',
        is_active: true,
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(`/dashboard/venues/${venue.id}/services`, {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditClick = (service: Service) => {
        setEditingService(service);
        editForm.setData({
            name: service.name,
            description: service.description || '',
            duration_minutes: service.duration_minutes,
            price: (service.price / 100).toString(),
            is_active: service.is_active,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        editForm.put(`/dashboard/venues/${venue.id}/services/${editingService.id}`, {
            onSuccess: () => {
                setEditingService(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (serviceId: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            addForm.delete(`/dashboard/venues/${venue.id}/services/${serviceId}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Services</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Create services with price and duration details.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl h-10 px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800">
                <CardContent className="p-0">
                    {services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 dark:text-neutral-400">
                            <Clock className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">No services yet</h3>
                            <p className="text-xs max-w-xs mt-1">Create services like massage, hair cut or car repair to let clients start booking.</p>
                            <Button onClick={() => setIsAddOpen(true)} variant="outline" className="mt-4 rounded-xl">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Service
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-neutral-200 dark:border-neutral-800">
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id} className="border-neutral-200 dark:border-neutral-800">
                                        <TableCell className="font-semibold">
                                            <div>
                                                <span className="text-neutral-900 dark:text-neutral-50">{service.name}</span>
                                                {service.description && (
                                                    <span className="block text-xs font-normal text-neutral-400 line-clamp-1 mt-0.5">
                                                        {service.description}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{service.duration_minutes} min</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                                            ${(service.price / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {service.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Visible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    Hidden
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full h-8 w-8 text-neutral-500"
                                                    onClick={() => handleEditClick(service)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full h-8 w-8 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
                                                    onClick={() => handleDelete(service.id)}
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

            {/* Add Service Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>Create a new service option for this venue.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name">Service Name</Label>
                            <Input
                                id="add-name"
                                required
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                placeholder="e.g. Classic Haircut"
                            />
                            <InputError message={addForm.errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-description">Description (Optional)</Label>
                            <Textarea
                                id="add-description"
                                value={addForm.data.description}
                                onChange={(e) => addForm.setData('description', e.target.value)}
                                placeholder="What does this service include?"
                                rows={2}
                            />
                            <InputError message={addForm.errors.description} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-duration">Duration (Minutes)</Label>
                                <Input
                                    id="add-duration"
                                    type="number"
                                    required
                                    value={addForm.data.duration_minutes}
                                    onChange={(e) => addForm.setData('duration_minutes', parseInt(e.target.value) || 0)}
                                    min={5}
                                    max={480}
                                />
                                <InputError message={addForm.errors.duration_minutes} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-price">Price (USD)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                    <Input
                                        id="add-price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={addForm.data.price}
                                        onChange={(e) => addForm.setData('price', e.target.value)}
                                        placeholder="25.00"
                                        className="pl-7"
                                    />
                                </div>
                                <InputError message={addForm.errors.price} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Active Status</Label>
                                <span className="text-xs text-neutral-400 block">Make this service active immediately.</span>
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
                                Create Service
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Service Dialog */}
            <Dialog open={editingService !== null} onOpenChange={(open) => !open && setEditingService(null)}>
                <DialogContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>Update service name, price, duration or visibility.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Service Name</Label>
                            <Input
                                id="edit-name"
                                required
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                rows={2}
                            />
                            <InputError message={editForm.errors.description} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-duration">Duration (Minutes)</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    required
                                    value={editForm.data.duration_minutes}
                                    onChange={(e) => editForm.setData('duration_minutes', parseInt(e.target.value) || 0)}
                                    min={5}
                                    max={480}
                                />
                                <InputError message={editForm.errors.duration_minutes} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-price">Price (USD)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', e.target.value)}
                                        className="pl-7"
                                    />
                                </div>
                                <InputError message={editForm.errors.price} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Active Status</Label>
                                <span className="text-xs text-neutral-400 block">Make this service active immediately.</span>
                            </div>
                            <Switch
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setEditingService(null)} className="rounded-xl">
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
