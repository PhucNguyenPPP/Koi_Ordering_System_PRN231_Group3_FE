import Footer from "./Footer/Footer";
import Header from "./Header/Header";


const LayoutCustomer = ({ children }) => {
    return (
        <>
            <Header />
            <div style={{paddingTop: '70px'}}>
                {children}
            </div>
            <Footer />
        </>
    );
};

export default LayoutCustomer;
