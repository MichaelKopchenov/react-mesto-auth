import iconYes from '../images/popup__icon_yes.svg';
import iconNo from '../images/popup__icon_no.svg';
import "./styles/InfoToolTip.css";

function InfoToolTip(props) {
  return (
    <div className={`popup ${props.isOpen ? 'popup_opened' : ''} `}>
      <div className="popup-info">
        <button className="popup__close-btn" type="button" aria-label="закрыть" onClick={props.onClose}></button>
        <img className='popup__icon' src={props.registeredIn ? iconYes : iconNo} alt="Иконка" />
        <h3>{props.registerText}</h3>
      </div>
    </div>
  )
}

export default InfoToolTip;