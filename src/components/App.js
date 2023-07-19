import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoToolTip from './InfoToolTip';
import * as auth from '../utils/auth.js';

const App = () => {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPicturePopupOpen, setIsPicturePopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [registeredIn, setRegisteredIn] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const registerText = registeredIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'

useEffect(() => {
  if (loggedIn) {
  Promise.all([api.getInitialCards(), api.getInitialProfile()])
    .then(([cards, dataOfUser]) => {
      setCards(cards);
      setCurrentUser(dataOfUser);
    })
    .catch((err) => {
      console.log(`Что-то пошло не так загрузке начальных даных ${err}`)
    });
  }
}, [loggedIn]);

useEffect(() => {
  handleTokenCheck();
}, []);

const handleTokenCheck = () => {
  if (token) {
    auth.checkToken(token).then((res) => {
      const userData = {
        email: res.data.email,
        password: res.data.password
      };
    setUserData(userData);
    setLoggedIn(true);
    navigate('/main', {replace: true})
  })
    .catch((err) => {console.log(err)}) 
  }
}

function handleLogin(isLog) {
  setLoggedIn(isLog);
}

function handleRegister(isReg) {
  setIsRegisterPopupOpen(true);
  setRegisteredIn(isReg);
}

function closeAllPopups() {
  setIsEditAvatarPopupOpen(false);
  setIsEditProfilePopupOpen(false);
  setIsAddPlacePopupOpen(false);
  setIsPicturePopupOpen(false);
  setIsRegisterPopupOpen(false);
};

const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isPicturePopupOpen

useEffect(() => {
  function closeByEscape(evt) {
    if(evt.key === 'Escape') {
      closeAllPopups();
    }
  }
  if(isOpen) {
    document.addEventListener('keydown', closeByEscape);
    return () => {
      document.removeEventListener('keydown', closeByEscape);
    }
  }
}, [isOpen]);


function handleEditProfileClick() {
  setIsEditProfilePopupOpen(true)
}

function handleAddPlaceClick() {
  setIsAddPlacePopupOpen(true)
}

function handleEditAvatarClick() {
  setIsEditAvatarPopupOpen(true)
}

function handleCardClick(data) {
  setSelectedCard({
    ...selectedCard,
    name: data.name,
    link: data.link
  })
  setIsPicturePopupOpen(true)
}

function handleCardLike(card) {
  const isLiked = card.likes.some((item) => item._id === currentUser._id);
  if (!isLiked) {
    api.putLike(card._id)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Что-то пошло не так при нажатии на Лайк ${err}`)
      });
  } else {
    api.unputLike(card._id)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Что-то пошло не так при снятии Лайка ${err}`)
      });
  }
};

function handleCardDelete(card) {
  api.deleteMyCard(card._id)
    .then(() => {
      const mapCards = [...cards.filter((item) => item._id !== card._id)];
      setCards(mapCards);
    })
    .catch((e) => console.log(e));
};

function handleUpdateUser(dataOfUser) {
  setIsLoading(true);
  api.setNewProfileData(dataOfUser)
    .then((dataOfUser) => {
      setCurrentUser(dataOfUser);
      setIsEditProfilePopupOpen(false);
    })
    .catch((err) => {
      console.log(`Что-то пошло не так при обновлении данных профиля ${err}`)
    })
    .finally(() => setIsLoading(false));
};

function handleUpdateAvatar(data) {
  setIsLoading(true);
  api.setNewAvatar(data.avatar)
    .then((data) => {
      setCurrentUser(data);
      setIsEditAvatarPopupOpen(false);
    })
    .catch((err) => {
      console.log(`Что-то пошло не так при обновлении аватара ${err}`)
    })    
    .finally(() => setIsLoading(false));

};

function handleAddPlaceSubmit(data) {
  setIsLoading(true);
  api.setNewCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      setIsAddPlacePopupOpen(false);
    })
    .catch((err) => {
      console.log(`Что-то пошло не так при удалении карточки ${err}`)
    })
    .finally(() => setIsLoading(false));
};

return (
  <CurrentUserContext.Provider value={currentUser}>
    <Header userData={userData} loggedIn={loggedIn} handleLogin={handleLogin} />
    <Routes>
      <Route path="/sign-in" element={<Login handleLogin={handleLogin} setUserData={setUserData} />} />
      <Route path="/sign-up" element={<Register handleRegister={handleRegister} />} />
      <Route path="/main" element={ <ProtectedRoute 
        element={(props) => (
          <Main
          {...props}
          cards={cards}
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick} 
          onEditAvatar={handleEditAvatarClick} 
          onCardClick = {handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          />
        )}
        loggedIn={loggedIn} />
    }
  />
    </Routes>

    <Footer/>

    <EditProfilePopup
      isLoading={isLoading}
      isOpen={isEditProfilePopupOpen}
      onClose={closeAllPopups}
      onUpdateUser={handleUpdateUser}
    />

    <EditAvatarPopup
      isOpen={isEditAvatarPopupOpen}
      onClose={closeAllPopups}
      onUpdateAvatar={handleUpdateAvatar}
    />

    <AddPlacePopup
      isLoading={isLoading}
      onClose={closeAllPopups}
      isAddPlacePopupOpen={isAddPlacePopupOpen}
      onAddPlace={handleAddPlaceSubmit}
    />

    <ImagePopup 
      card={selectedCard} 
      isOpen={isPicturePopupOpen} 
      onClose={closeAllPopups}
    />

    <PopupWithForm name="delete" title="Вы уверены?" buttonText="Да" />

    <InfoToolTip registerText={registerText} registeredIn={registeredIn} isOpen={isRegisterPopupOpen} onClose={closeAllPopups} />
  </CurrentUserContext.Provider>
);
};

export default App;