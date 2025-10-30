import { useAppState, useAppActions } from './AppContext';
import { LoginTab } from './loginTab';

export function Header() {
  const { theme, user } = useAppState();
  const { setTheme, signOut } = useAppActions();

  return (
    <header>
      <span>Theme: {theme} </span>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button><br></br>
      {/* <LoginTab></LoginTab> */}
    </header>
  );
}