import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { userSchema } from '@/schema/user'
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

interface inputData {
  email: string
  password: string
}

const SignIn = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth, setAuth } = useAuth()

  const toNavigateAfterSuccess = location?.state?.from?.pathname || '/'

  useEffect(() => {
    if (auth?.accessToken) navigate('/', { replace: true })
  }, [])

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: inputData) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      })

      if (response.status === 200) {
        navigate(toNavigateAfterSuccess, { replace: true })
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
      <div className="bg-muted absolute lg:relative top-0 md:top-10 lg:top-0">
        <img
          src={coverImg}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="absolute inset-y-28 bottom-0 inset-x-0 lg:inset-y-0 lg:relative flex items-center justify-center p-6 py-12 col-span-2 md:mt-20 lg:-mt-4">
        <Card className="z-10 m-auto grid w-full gap-6 bg-white lg:w-[550px] lg:px-8 lg:py-4 relative">
          <Button
            variant="ghost"
            className="border rounded-full h-9 w-9 lg:h-12 lg:w-12 p-0 absolute -left-2 bg-white z-10 -top-2"
            onClick={() => navigate('/')}
          >
            <ArrowUpLeft className="flex-shrink-0" />
          </Button>
          <CardHeader className="-mb-8">
            <CardTitle className="text-2xl">Let's sign in!</CardTitle>
            <CardDescription>
              Enter your credentials below to login to your account ..
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
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full py-6"
                  asChild
                >
                  <Link to="/onboarding/register">
                    Don't have an account? Register here
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

export default SignIn
