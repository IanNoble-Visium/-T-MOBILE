import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoBackground from './VideoBackground'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@tmobile.com')
  const [password, setPassword] = useState('TruContext2025!')
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with real authentication service
      // Example for future SSO integration:
      // const response = await authService.loginWithSSO({
      //   email,
      //   password,
      //   rememberMe,
      //   ssoProvider: 'azure-ad' // or 'okta', 'onelogin', etc.
      // })
      // const { token, user } = response

      // Demo authentication - replace with real auth in production
      if (email && password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Store auth state
        const authData = {
          user: {
            id: '1',
            email,
            name: 'Admin User',
            role: 'admin',
            organization: 'T-Mobile',
          },
          token: 'demo-jwt-token-' + Date.now(),
          isAuthenticated: true,
        }

        if (rememberMe) {
          localStorage.setItem('authData', JSON.stringify(authData))
        } else {
          sessionStorage.setItem('authData', JSON.stringify(authData))
        }

        onLogin(authData)
        navigate('/dashboard')
      } else {
        setError('Please enter your credentials')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video background component */}
      <VideoBackground />

      {/* Login card container */}
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Glassmorphic card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E20074] to-[#A60052] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold text-white tracking-tight">TruContext</h1>
                <p className="text-xs text-white/60">by T-Mobile</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-white/70 text-sm">
              Secure access to your network intelligence platform
            </p>
          </div>

          {/* Form section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@tmobile.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-[#E20074]/50 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-[#E20074]/50 backdrop-blur-sm"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Remember me checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-white/30"
              />
              <Label
                htmlFor="remember"
                className="text-white/80 text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#E20074] to-[#A60052] hover:from-[#C90063] hover:to-[#8E0044] text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gradient-to-b from-white/10 to-transparent text-white/50">
                Demo Access
              </span>
            </div>
          </div>

          {/* SSO note (for future implementation) */}
          <p className="text-center text-white/60 text-xs">
            {/* TODO: Single Sign-On integration */}
            {/* Add SSO buttons here for production:
            <button>Sign in with Azure AD</button>
            <button>Sign in with Okta</button>
            <button>Sign in with Google Workspace</button>
            */}
            Production will support SSO integration
          </p>

          {/* Footer links */}
          <div className="flex items-center justify-between text-xs text-white/50 pt-4 border-t border-white/10">
            <button
              type="button"
              className="hover:text-white/80 transition-colors"
              onClick={() => {
                /* TODO: Implement forgot password flow */
              }}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="hover:text-white/80 transition-colors"
              onClick={() => {
                /* TODO: Implement support contact */
              }}
            >
              Support
            </button>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center text-white/50 text-xs">
          <p>
            🔒 Secure encrypted connection • Demo credentials pre-filled for presentation
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
