import AppProviders from "@/app/providers/AppProviders";
import AppRoutes from "@/routes/AppRoutes";
import { useAuthTokenEffect } from "@/features/auth/useAuthTokenEffect";
import AuthInitializer from "@/features/auth/AuthInitializer";

function AuthTokenBridge() {
  useAuthTokenEffect();
  return null;
}

function App() {
  return (
    <AppProviders>
      <AuthTokenBridge />
      <AuthInitializer />
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
