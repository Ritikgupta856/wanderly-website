'use client'

import axios from 'axios'

import { FcGoogle } from 'react-icons/fc'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import Modal from './modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import toast from 'react-hot-toast'
import Button from '../Button'
import { signIn } from 'next-auth/react'

import useRegisterModal from '@/app/hooks/useRegisterModal'
import useLoginModal from '@/app/hooks/useLoginModal'


const RegisterModal = () => {

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);


        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose();
                toast.success("Success!")
                loginModal.onOpen();
            })

            .catch((error) => {
                toast.error('Something Went Wrong')
            })

            .finally(() => {
                setIsLoading(false);
            })
    }


    const toggle = useCallback(()=>{
        registerModal.onClose();
        loginModal.onOpen();
     
    },[loginModal,registerModal])


    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Welcome to Airbnb' subtitle='Create an Account' />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required />
        </div>
    )


    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <Button
                outline
                label='Continue with Google'
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
        <div className='flex flex-row justify-center items-center gap-2 mt-4 font-light text-neutral-500'>
          <div>
            Already have an account?
          </div>

          <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
            Log in
          </div>
        </div>
        </div>


    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}


        />
    )
}

export default RegisterModal
