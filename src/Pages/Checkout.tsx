import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import CartItemsList from "../Components/CartItemsList";
import CartSummary from "../Components/CartSummary";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { checkout, type CheckoutRequest } from "../api/cart";

interface OrderFormData {
  name: string;
  surname: string;
  email: string;
  address: string;
  zipCode: string;
}

const Checkout = () => {
  const { totalPrice, clearCart } = useCart();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    surname: "",
    email: "",
    address: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email) {
          setFormData(prev => ({
            ...prev,
            email: user.email
          }));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleInputChange = useCallback((field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Please log in to complete checkout");
      }

      const checkoutData: CheckoutRequest = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        zip_code: formData.zipCode,
        address: formData.address,
      };

      await checkout(checkoutData, token);
      
      clearCart();
      
      navigate("/success");
    } catch (error: unknown) {
      console.error("Failed to place order:", error);
      
      if (error instanceof Error && error.message && error.message.includes("errors")) {
        try {
          const errorMatch = error.message.match(/\{.*\}/);
          if (errorMatch) {
            const errorData = JSON.parse(errorMatch[0]);
            if (errorData.errors) {
              setErrors(errorData.errors);
            }
          }
        } catch (parseError) {
          console.error("Error parsing error data:", parseError);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : "Failed to place order. Please try again.";
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, getToken, clearCart, navigate]);

  return (
    <div >
      <Header />
      <div className="flex flex-col mt-[72px] gap-[42px] px-[100px]">
        <h1 className="poppins-font font-[600] text-[42px] text-DarkBlue">
          Checkout
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[131px] items-start">
            {/* Order Form */}
            <div className="w-[1129px] h-[635px] bg-Gray rounded-[16px] pt-[100px] pl-[50px]">
              <h2 className="poppins-font font-[500] text-[22px] text-DarkBlue2 mb-[70px]">
                Order details
              </h2>
              <div className="flex justify-between pr-[100px]">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex items-center gap-[30px]">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`border ${errors.name ? 'border-red-500' : 'border-Gray2'} bg-White rounded-[8px] p-[12px] w-[277px] h-[42px] poppins-font font-[400] text-[14px] text-DarkBlue2`}
                        required
                      />
                      {errors.name && (
                        <span className="text-red-500 text-xs mt-1 poppins-font">
                          {errors.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={(e) => handleInputChange("surname", e.target.value)}
                        className={`border ${errors.surname ? 'border-red-500' : 'border-Gray2'} bg-White rounded-[8px] p-[12px] w-[277px] h-[42px] poppins-font font-[400] text-[14px] text-DarkBlue2`}
                        required
                      />
                      {errors.surname && (
                        <span className="text-red-500 text-xs mt-1 poppins-font">
                          {errors.surname[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`border ${errors.email ? 'border-red-500' : 'border-Gray2'} bg-White rounded-[8px] p-[12px] w-[578px] h-[42px] poppins-font font-[400] text-[14px] text-DarkBlue2`}
                      required
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1 poppins-font">
                        {errors.email[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-[30px]">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={`border ${errors.address ? 'border-red-500' : 'border-Gray2'} bg-White rounded-[8px] p-[12px] w-[277px] h-[42px] poppins-font font-[400] text-[14px] text-DarkBlue2`}
                        required
                      />
                      {errors.address && (
                        <span className="text-red-500 text-xs mt-1 poppins-font">
                          {errors.address[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Zip code"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className={`border ${errors.zip_code ? 'border-red-500' : 'border-Gray2'} bg-White rounded-[8px] p-[12px] w-[277px] h-[42px] poppins-font font-[400] text-[14px] text-DarkBlue2`}
                        required
                      />
                      {errors.zip_code && (
                        <span className="text-red-500 text-xs mt-1 poppins-font">
                          {errors.zip_code[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cart Summary Section */}
            <div className="flex flex-col gap-[32px] min-w-[400px]">
              <div className="bg-White rounded-[16px] p-[32px] shadow-lg">
                <h2 className="poppins-font font-[500] text-[20px] text-DarkBlue mb-[24px]">
                  Your Order
                </h2>
                <div className="max-h-[300px] overflow-y-auto mb-[24px]">
                  <CartItemsList />
                </div>
                <div className="pt-[24px]">
                  <CartSummary totalPrice={totalPrice} />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] bg-Red rounded-[10px] flex justify-center items-center cursor-pointer mt-[24px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-Red/90 transition-colors"
                >
                  <span className="poppins-font font-[500] text-[16px] text-White">
                    {isSubmitting ? "Processing..." : "Pay"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
