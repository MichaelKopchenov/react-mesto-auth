import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logo.svg';
import './styles/Header.css'

function Header (props) {
  const [email, setEmail] = React.useState('')

  const location = useLocation();
  const navigate = useNavigate();

  const [info, setInfo] = React.useState({buttonText: '', path: ''});

  React.useEffect(() => {
    if (location.pathname === '/sign-in') {
      setInfo({buttonText: 'Регистрация', path: '/sign-up'});
    } if (location.pathname === '/sign-up') {
      setInfo({buttonText: 'Войти', path: '/sign-in'});
    } if (location.pathname === '/main') {
      setInfo({buttonText: 'Выйти', path: ''});
    }
  }, [location]);

  React.useEffect(() => {
    if (location.pathname === '/main') {
      setEmail(props.userData.email);
    } else {
      setEmail('');
    }
  }, [location]);

  function signOut() {
    localStorage.removeItem('jwt');
    props.handleLogin(false)
    navigate('/sign-in', {replace: true});
  }

  function handleClick () {
    navigate(info.path, {replace: true});
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип"/>
      <div className="header__menu">
        <button className='header__button' onClick={props.loggedIn ? signOut : handleClick}>
          {info.buttonText}
        </button>
        <p className='header__info'>{email}</p>
      </div>
    </header>
  )
}

export default Header;