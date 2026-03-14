const WhatsAppButton: React.FC = () => {
  const phoneNumber = '1555123456'; // WhatsApp number without + or spaces
  const message = encodeURIComponent('Hi! I am interested in your tour packages.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      className="btn whatsapp-btn rounded-circle shadow position-fixed d-flex align-items-center justify-content-center p-0"
      style={{ bottom: 30, right: 30, width: 60, height: 60 }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <i className="bi bi-whatsapp" aria-hidden style={{ fontSize: 24, color: 'white' }} />
    </a>
  );
};

export default WhatsAppButton;
