import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { registerUserSchema } from '@/schema/user'
import coverImg from '@/assets/coverImg.jpg'
import FormError from '@/components/ui/formError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import PasswordInput from '@/components/ui/passwordInput'
import useAuth from '@/hooks/useAuth'
import api from '@/lib/axios'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'

const Register = () => {
  const navigate = useNavigate()
  const { auth, setAuth } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (auth?.accessToken) navigate('/', { replace: true })
  }, [])

  const form = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof registerUserSchema>) => {
    try {
      const response = await api.post('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName ?? null,
        email: data.email,
        password: data.password,
      })

      if (response.status === 200) {
        toast({
          description: 'You have registered successfully!',
          variant: 'success',
        })

        navigate('/onboarding/signin', { replace: true })
      }

      setAuth({
        user: response.data?.email,
        accessToken: response.data?.token,
      })
    } catch (error: any) {
      const message = error?.response?.data?.error
      form.setError('password', { message: message })
    }
  }

  return (
    <section className="w-full lg:h-[100vh] lg:grid lg:grid-cols-3 overflow-hidden">
      <div className="bg-muted absolute lg:relative top-0 lg:top-0">
        <img
          src={coverImg}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="absolute inset-y-52 bottom-0 inset-x-0 lg:inset-y-0 lg:relative flex items-center justify-center p-6 py-12 col-span-2 md:mt-20 lg:-mt-4">
        <Card className="z-10 m-auto grid w-full gap-6 bg-white lg:w-[550px] lg:px-8 lg:py-4 relative">
          <Button
            variant="ghost"
            className="border rounded-full h-9 w-9 lg:h-12 lg:w-12 p-0 absolute -left-2 bg-white z-10 -top-2"
            onClick={() => navigate(-1)}
          >
            <ArrowUpLeft className="flex-shrink-0" />
          </Button>
          <CardHeader className="-mb-8">
            <CardTitle className="text-2xl">
              Let's create your account!
            </CardTitle>
            <CardDescription>
              Enter your personal details below to create to your account ..
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 grid gap-3"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>First Name</Label>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>

                      <FormError errorField={form.formState.errors.email} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Last Name</Label>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>

                      <FormError errorField={form.formState.errors.email} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Middle Name</Label>
                      <FormControl>
                        <Input placeholder="(Optional)" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input placeholder="admin@agenda.com" {...field} />
                      </FormControl>

                      <FormError errorField={form.formState.errors.email} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>

                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormError errorField={form.formState.errors.password} />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full rounded-full py-6"
                  size="lg"
                >
                  Create Account
                </Button>

                <Button variant="outline" asChild>
                  <Link to="/onboarding/signin">
                    Already have an account? Login here
                  </Link>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Register
