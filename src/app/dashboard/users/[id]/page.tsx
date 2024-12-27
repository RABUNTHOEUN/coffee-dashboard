"use client"; // For client-side rendering

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { baseUrl } from '@/utils/config';
import { toast } from 'sonner';

const UserDetail: React.FC = () => {
  const { id } = useParams(); // Dynamic ID from the route
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user details
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/users/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => {
          setUser({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            role: data.role || '',
            phoneNumber: data.phoneNumber || '',
          });
        })
        .catch((err) => {
          setError('Failed to fetch user data');
          toast.error(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success('User updated successfully!');
      router.push('/dashboard/users');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating user: ${error.message}`);
      } else {
        toast.error('Error updating user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="First Name"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Last Name"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Role"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="tel"
              placeholder="Phone Number"
              value={user.phoneNumber}
              onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default UserDetail;
