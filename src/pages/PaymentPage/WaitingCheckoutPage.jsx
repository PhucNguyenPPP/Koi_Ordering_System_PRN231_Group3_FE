import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import WaitingCheckout from "../../components/partial/PaymentPage/WaitingCheckout";

const WaitingCheckoutPage = () => {
    return (
        <>
            <Header />
            <WaitingCheckout />
            <Footer />
        </>
    );
};

export default WaitingCheckoutPage;