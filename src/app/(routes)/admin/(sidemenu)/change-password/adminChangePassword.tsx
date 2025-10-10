'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiOutlineLoading } from 'react-icons/ai';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { getPasswordStrength } from '@/components/_admin_components/_change_password_components/PasswordStrengthChecker';
import { useRouter } from 'next/navigation';
import adminRoutes from '@/lib/adminRoutes';

interface FormInputT {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AdminChangePassword = ({
  className,
  ...props
}: ChangePasswordFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { control, handleSubmit, setError, formState } = useForm<FormInputT>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { errors } = formState;
  const [passwordStrengthVisible, setPasswordStrengthVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const onSubmit: SubmitHandler<FormInputT> = async (formData) => {
    const { currentPassword, newPassword, confirmPassword } = formData;

   
    if (currentPassword.trim() === '') {
      setError('currentPassword', {
        type: 'manual',
        message: 'This field is required',
      });
      return;
    }
    if (newPassword.trim() === '') {
      setError('newPassword', {
        type: 'manual',
        message: 'This field is required',
      });
      return;
    }

    if (confirmPassword.trim() === '') {
      setError('confirmPassword', {
        type: 'manual',
        message: 'This field is required',
      });
      return;
    }

  
    const isPasswordValid = validatePassword(newPassword);
    if (!isPasswordValid) {
      setError('newPassword', {
        type: 'manual',
        message: 'Password format not matched',
      });
      return;
    }

 
    if (newPassword !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Confirm Password should be the same as the new password',
      });
      return;
    }

    if (newPassword === currentPassword) {
      setError('currentPassword', {
        type: 'manual',
        message: 'These Cannot be same',
      });
      return;
    }

    try {
      const {data} = await axios.post(
        '/api/changePassword',
        JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        })
      );
      console.log(adminRoutes.changePassword)
      if (data) {
        router.push( adminRoutes.dashboard);
        toast({ description: `${data.message}` });
      }
    
    } catch (error) {   
   
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.error || error.message,
          variant: 'destructive',
        });
      } 
    }
  };

  const handleNewPasswordChange = (value: string) => {
    if (value.trim() !== '') {
      setPasswordStrengthVisible(true);
      setPasswordStrength(getPasswordStrength(value));
    } else {
      setPasswordStrengthVisible(false);
      setPasswordStrength('');
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return false;
    }

    if (value.length < 8) {
      return false;
    }

    if (!/[A-Z]/.test(value)) {
      return false;
    }

    if (!/[a-z]/.test(value)) {
      return false;
    }

    if (!/[0-9]/.test(value)) {
      return false;
    }

    return true;
  };

  return (
    <div className={className} {...props} >
      <form  onSubmit={handleSubmit(onSubmit)} >
        <div className="grid gap-2">
       
          <div className="grid gap-1">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    type="password"
                    id="currentPassword"
                    placeholder="Current Password"
                    className={`${
                      errors.currentPassword &&
                      field.value.trim() === '' &&
                      'border-red-500'
                    }`}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

      
          <div className="flex grid gap-1">
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    className={`${
                      (errors.newPassword && field.value.trim() === '') ||
                      errors.confirmPassword ||
                      (errors.newPassword &&
                        errors.newPassword.type === 'manual' &&
                        'border-red-500')
                    }`}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNewPasswordChange(e.target.value);
                    }}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

       
          <div className="flex grid gap-1">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`${
                      (errors.confirmPassword && field.value.trim() === '') ||
                      (errors.confirmPassword &&
                        errors.confirmPassword.type === 'manual' &&
                        'border-red-500')
                    }`}
                  />
                  {errors.confirmPassword &&
                    (errors.confirmPassword.type === 'manual' ||
                      !field.value) && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                </div>
              )}
            />
          </div>

           {passwordStrengthVisible && (
            <div>
              <p>Password Strength: {passwordStrength}</p>
              <div
                className={`h-2 w-full rounded ${
                  passwordStrength === 'Weak'
                    ? 'bg-red-500'
                    : passwordStrength === 'Medium'
                    ? 'bg-orange-500'
                    : passwordStrength === 'Strong' && 'bg-green-500'
                }`}
              ></div>
            </div>
          )}

        
          <Button
            type="submit"
            className='bg-green-500 hover:bg-green-600'
            
          >
            {formState.isSubmitting && (
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
}
export default AdminChangePassword ;
