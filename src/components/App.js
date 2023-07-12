import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPicturePopupOpen, setIsPicturePopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  Promise.all([api.getInitialCards(), api.getInitialProfile()])
    .then(([cards, dataOfUser]) => {
      setCards(cards);
      setCurrentUser(dataOfUser);
    })
    .catch((err) => {
      console.log(`Что-то пошло не так загрузке начальных даных ${err}`)
    });
}, [])

function closeAllPopups() {
  setIsEditAvatarPopupOpen(false);
  setIsEditProfilePopupOpen(false);
  setIsAddPlacePopupOpen(false);
  setIsPicturePopupOpen(false);
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
}, [isOpen]) 


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
    <Header/>

    <Main 
      cards={cards}
      onEditProfile={handleEditProfileClick} 
      onAddPlace={handleAddPlaceClick} 
      onEditAvatar={handleEditAvatarClick} 
      onCardClick = {handleCardClick}
      onCardLike={handleCardLike}
      onCardDelete={handleCardDelete}
    />

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
  </CurrentUserContext.Provider>
);
};

export default App;