import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

import {
  Card,
  CardContent,
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { LoadingButton } from '@/components/custom/LoadingButton';
import { useAppDispatch } from '@/store';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/lib/zodValidation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { handleApiError } from '@/lib';
import type { Image, User } from '@/types/models';
import { setCredentials } from '@/store/slices/authSlice';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [signupImage, setSignupImage] = useState<File | null>(null);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const { post, isMutating, uploadFile } = useApi(ENDPOINT_URLS.USERS.LOGIN, {
    immediate: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      image: {
        url: '',
        public_id: '',
      },
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const {
        data: { user, token },
      } = await post<{ user: User; token: string }>(ENDPOINT_URLS.USERS.LOGIN, data);
      dispatch(setCredentials({ token, user }));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      handleApiError(error, loginForm.setError);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      if (signupImage) {
        const formData = new FormData();
        formData.append('file', signupImage as File);
        formData.append('folder', 'users');
        const { response } = await uploadFile(ENDPOINT_URLS.USERS.IMAGE.UPLOAD, formData);
        if (response.success) {
          data.image = {
            url: (response.data as Image)?.url as string,
            public_id: (response.data as Image)?.public_id as string,
          };
        }
      }

      const {
        data: { user, token },
      } = await post<{ user: User; token: string }>(ENDPOINT_URLS.USERS.SIGNUP, data);
      dispatch(setCredentials({ token, user }));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      handleApiError(error, signupForm.setError);
    }
  };

  const handleSignupImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSignupImage(file);
    const previewUrl = URL.createObjectURL(file);
    signupForm.setValue('image', {
      url: previewUrl,
      public_id: '',
    });
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('folder', 'users');
    // const { data } = await uploadFile(ENDPOINT_URLS.USERS.IMAGE.UPLOAD, formData);
    // setSignupImage({
    //   url: (data as Image)?.url ?? '',
    //   public_id: (data as Image)?.public_id ?? '',
    // });
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
            <p className="text-muted-foreground mt-2">Sign in or create an account to continue</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Enter your password"
                                  {...field}
                                  aria-invalid={!!loginForm.formState.errors.password}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <LoadingButton
                        type="submit"
                        className="w-full"
                        isLoading={isMutating}
                        disabled={isMutating}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </LoadingButton>
                    </form>
                  </Form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="size-20 rounded-full bg-background border flex items-center justify-center overflow-hidden">
                          {signupForm.watch('image')?.url ? (
                            <img
                              src={signupForm.watch('image').url}
                              alt="Profile"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-gray-400 text-2xl flex items-center justify-center">
                              <Camera className="h-8 w-8" />
                            </span>
                          )}
                        </div>
                      </div>
                      <input
                        className="hidden"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSignupImageChange}
                      />

                      <FormField
                        control={signupForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showSignupPassword ? 'text' : 'password'}
                                  placeholder="Enter your password"
                                  {...field}
                                  aria-invalid={!!signupForm.formState.errors.password}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                                >
                                  {showSignupPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <LoadingButton
                        type="submit"
                        className="w-full"
                        isLoading={isMutating}
                        disabled={isMutating}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </LoadingButton>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>

      {/* Right side - Image (60%) */}
      <div className="hidden lg:block lg:w-3/5 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <img
          src="https://cdn.pixabay.com/photo/2017/08/10/01/23/shopping-2616824_1280.jpg"
          alt="Shopping"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-2xl text-center space-y-6 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight">Start Your Shopping Journey</h2>
            <p className="text-lg text-muted-foreground">
              Discover amazing products, exclusive deals, and a seamless shopping experience.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="p-6 rounded-lg bg-card border shadow-sm">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground mt-2">Products</div>
              </div>
              <div className="p-6 rounded-lg bg-card border shadow-sm">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-2">Happy Customers</div>
              </div>
              <div className="p-6 rounded-lg bg-card border shadow-sm">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-2">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
