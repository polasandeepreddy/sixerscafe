import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, CreditCard } from 'lucide-react';


const facilities = [
  {
    imgSrc: 'https://media.hudle.in/photos/59418',
    alt: 'Professional Cricket Pitch',
    title: 'Professional Cricket Pitch',
    description: 'Play on a meticulously maintained pitch designed to professional standards.',
  },
  {
    imgSrc: 'https://knowledgegk.com/wp-content/uploads/2024/02/Box-Cricket_2.jpg',
    alt: 'Floodlit Night Matches',
    title: 'Floodlit Night Matches',
    description: 'Play exciting matches under bright floodlights with perfect visibility.',
  },
  {
    imgSrc: 'https://res.cloudinary.com/purnesh/image/upload/f_auto/v1559298070/beyond-lines-h.jpg',
    alt: 'Player Lounges & Rest Areas',
    title: 'Player Lounges & Rest Areas',
    description: 'Comfortable seating and refreshment zones where players can relax and recharge.',
  },
  {
    imgSrc: 'https://th.bing.com/th/id/OIP.Pmlu027dTdts_YwoJpCpGwHaE7?rs=1&pid=ImgDetMain',
    alt: 'Professional Coaching',
    title: 'Professional Coaching & Training',
    description: 'Access expert coaches for skill development, fitness training, and strategy.',
  },
  {
    imgSrc: 'https://static.vecteezy.com/system/resources/previews/000/378/316/original/wifi-vector-icon.jpg',
    alt: 'Wi-Fi & Streaming',
    title: 'High-Speed Wi-Fi & Live Streaming',
    description: 'Stay connected with fast internet access and enjoy live streaming of matches.',
  },
  {
    imgSrc: 'https://i.pinimg.com/originals/2c/73/29/2c7329560702d29cbe9af756e730b464.jpg',
    alt: 'Parking',
    title: 'Parking Space',
    description: 'Convenient and secure parking for players and visitors close to the facility entrance.',
  },
  {
    imgSrc: 'https://images.pexels.com/photos/3935484/pexels-photo-3935484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Cafeteria & Refreshments',
    title: 'Cafeteria & Refreshments',
    description: 'Enjoy snacks, beverages, and healthy refreshments before or after your game.',
  },
  {
    imgSrc: 'https://images.pexels.com/photos/896922/pexels-photo-896922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'First Aid & Medical Support',
    title: 'First Aid & Medical Support',
    description: 'On-site first aid services and quick access to medical support to ensure safety.',
  }
];

const FacilityCardSmall = ({ imgSrc, alt, title, description }) => (
  <div className="card shadow-sm me-3 facility-card" style={{ minWidth: '250px', maxWidth: '250px' }}>
    <img src={imgSrc} alt={alt} className="card-img-top facility-img" loading="lazy" />
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text text-truncate">{description}</p>
    </div>
  </div>
);

const FacilitiesScroller = ({ items, repeat = 2 }) => {
  const repeatedItems = Array.from({ length: repeat }).flatMap(() => items);
  return (
    <div className="d-flex facility-scroll">
      {repeatedItems.map((facility, i) => (
        <FacilityCardSmall
          key={i}
          imgSrc={facility.imgSrc}
          alt={facility.alt}
          title={facility.title}
          description={facility.description}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="position-relative text-white" style={{
        backgroundImage: `url('https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '70vh',
      }}>
        <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
        <div className="container h-100 d-flex flex-column justify-content-center align-items-center position-relative text-center">
          <h1 className="display-4 fw-bold">Cricket Box</h1>
          <p className="lead mb-4 max-w-600px">Premium cricket box facility for enthusiasts. Book your slot today!</p>
          <Link to="/booking" className="btn btn-success btn-lg shadow-lg">
            Book Slot Now
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4">
            {[
              {
                icon: <Calendar className="text-success" size={40} />,
                title: '1. Pick Your Date',
                text: 'Choose from our available dates to play your cricket match.',
              },
              {
                icon: <Clock className="text-success" size={40} />,
                title: '2. Select Time Slot',
                text: 'Browse available time slots and select the ones that work for you.',
              },
              {
                icon: <CreditCard className="text-success" size={40} />,
                title: '3. Pay & Play',
                text: 'Complete the payment using UPI and confirm your booking instantly.',
              },
            ].map(({ icon, title, text }, index) => (
              <div key={index} className="col-md-4 text-center">
                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10" style={{ width: '80px', height: '80px' }}>
                  {icon}
                </div>
                <h5 className="fw-semibold mb-3">{title}</h5>
                <p className="text-muted">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/booking" className="text-success fw-bold text-decoration-none">
              Book a slot now &nbsp;
              <svg className="bi bi-arrow-right" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.146 12.354a.5.5 0 0 0 .708-.708L8.707 10H15.5a.5.5 0 0 0 0-1H8.707l2.147-1.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Auto-scroll */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Our Premium Facilities</h2>
          <div className="overflow-hidden">
            <FacilitiesScroller items={facilities} repeat={2} />
          </div>
        </div>
      </section>

      {/* Ready to Play CTA */}
      <section className="py-5 bg-light">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between rounded shadow-sm p-4">
          <div className="mb-3 mb-md-0">
            <h3 className="fw-bold">Ready to Play?</h3>
            <p className="text-muted mb-0">
              Book your cricket box slot now and enjoy the best cricket facility in town.
              Limited slots available each day!
            </p>
          </div>
          <Link to="/booking" className="btn btn-success btn-lg">
            Book Your Slot
          </Link>
        </div>
      </section>

      {/* Custom CSS */}
      <style>{`
        .overlay {
          z-index: 0;
        }
        section > .container > .row > div {
          min-height: 220px;
        }
        .facility-scroll {
          animation: scroll-left 15s linear infinite;
        }
        .facility-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .facility-card img {
          transition: transform 0.3s ease;
        }
        .facility-card img:hover {
          transform: scale(1.05);
        }
        .text-truncate {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .max-w-600px {
          max-width: 600px;
        }
      `}</style>
    </>
  );
};

export default HomePage;
