import { Link } from "react-router-dom";

const ContactAdmin = () => {
  return (
    <div id="contact-admin" className="d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img
                    src="/icon.svg"
                    alt="Taman Herbal Lawu"
                    className="mb-3"
                    style={{ width: "80px" }}
                  />
                  <h2 className="fw-bold text-primary">Contact Admin</h2>
                </div>
                <div className="text-center mb-4">
                  <p>
                    If you've forgotten your password or need to create a new account,
                    please contact the administrator using the information below:
                  </p>
                  <p>
                    <strong>Email:</strong> admin@tamanherballawu.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +62 123 456 7890
                  </p>
                  <p>
                    Office hours: Monday to Friday, 9:00 AM - 5:00 PM (WIB)
                  </p>
                </div>
                <div className="text-center">
                  <Link to="/login" className="btn btn-primary w-100 mb-3">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;