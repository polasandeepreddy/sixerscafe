import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer bg-dark text-white pt-5 pb-4">
        <div className="container">
          <div className="row">
            {/* Logo & Description */}
            <div className="col-md-4 mb-4">
              <Link to="/" className="d-flex align-items-center mb-3 text-decoration-none">
                <img
                  src="/cricket-logo.png"
                  alt="Sixers Cafe"
                  className="footer-logo me-2"
                />
                <span className="fs-4 fw-bold">Sixers Cafe</span>
              </Link>
              <p className="footer-text">
                Premium cricket box facility with state-of-the-art amenities for cricket enthusiasts.
                Book your slot today and experience the thrill of the game!
              </p>
              <p className="footer-small-text mt-3">
                Open daily from 6 AM to 11 PM | Advance & full booking available
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">Quick Links</h5>
              <ul className="list-unstyled footer-links">
                <li>
                  <Link to="/" className="text-white text-decoration-none">Home</Link>
                </li>
                <li>
                  <Link to="/booking" className="text-white text-decoration-none">Book a Slot</Link>
                </li>
                <li>
                  <Link to="/admin" className="text-white text-decoration-none">Admin</Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">Contact Us</h5>
              <ul className="list-unstyled footer-contact">
                <li className="d-flex align-items-start mb-3">
                  <MapPin className="icon me-2" />
                  <span>
                    Giddalur Cumbum Road, Near Kothapalle, Giddalur, Prakasam, Andhra Pradesh, India - 523357
                  </span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <Phone className="icon me-2" />
                  <a href="tel:+917893746706" className="text-white text-decoration-none">
                    +91 7893746706
                  </a>
                </li>
                <li className="d-flex align-items-center">
                  <Mail className="icon me-2" />
                  <a href="mailto:info@sixerscafe.com" className="text-white text-decoration-none">
                    info@sixerscafe.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-secondary" />

          <div className="text-center text-secondary small">
            &copy; {new Date().getFullYear()} Sixers Cafe. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          background-color: #1c1c1c;
        }

        .footer-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .footer-text {
          color: #cfcfcf;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .footer-small-text {
          font-size: 0.85rem;
          color: #9a9a9a;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links li a:hover {
          color: #28a745;
          text-decoration: underline;
        }

        .footer-contact .icon {
          color: #28a745;
          width: 20px;
          height: 20px;
          margin-top: 3px;
        }

        .footer-contact a:hover {
          color: #28a745;
          text-decoration: underline;
        }

        @media (max-width: 767.98px) {
          .footer {
            text-align: center;
          }

          .footer-contact li {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
