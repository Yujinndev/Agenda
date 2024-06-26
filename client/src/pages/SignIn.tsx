import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { userSchema } from '@/schema/user'
import axios from '@/lib/axios'
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

interface inputData {
  email: string
  password: string
}

const SignIn = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: inputData) => {
    try {
      const response = await axios.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      const userdetails = response?.data?.userId
      const token = response?.data?.token

      localStorage.setItem('_tkn', token)
      // useAuthStore.getState().login(userdetails)

      window.location.href = 'http://localhost:5173/dashboard'
    } catch (error: any) {
      const message = error?.response?.data?.error
      form.setError('password', { message: message })
    }
  }

  return (
    <section className="w-full lg:h-[92.5vh] lg:grid lg:grid-cols-3 overflow-hidden">
      <div className="bg-muted absolute lg:relative top-10 lg:top-0">
        <img
          src={coverImg}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="absolute inset-y-28 inset-x-0 lg:inset-y-0 lg:relative flex items-center justify-center p-6 py-12 col-span-2 lg:-mt-20">
        <Card className="z-10 m-auto grid w-full gap-6 bg-white lg:w-[550px] lg:px-8 lg:py-4">
          <CardHeader className="-mb-8">
            <CardTitle className="text-2xl">Let's sign in!</CardTitle>
            <CardDescription>
              Enter your details below to login to your account ..
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
                        <Input
                          placeholder="admin@lasuperiormercados.com"
                          {...field}
                        />
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
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormError errorField={form.formState.errors.password} />
                    </FormItem>
                  )}
                />
                {/* <FormError errorField={form.formState.errors.root} /> */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full rounded-full py-6"
                  size="lg"
                >
                  Sign in
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
