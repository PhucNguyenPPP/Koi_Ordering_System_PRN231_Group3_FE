import React from 'react';
import styles from './KoiDetail.module.scss';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StoreIcon from '@mui/icons-material/Store';

// Sample data for recommended Koi
const kois = [
    {
        name: "Koi KO94783",
        farm: "Farm A",
        price: "45.000.000 đ",
        gender: "Female",
        breed: "Shiro Utsuri",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    {
        name: "Koi KO94784",
        farm: "Farm B",
        price: "60.000.000 đ",
        gender: "Male",
        breed: "Sanke",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    {
        name: "Koi KO94783",
        farm: "Farm A",
        price: "45.000.000 đ",
        gender: "Female",
        breed: "Shiro Utsuri",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    {
        name: "Koi KO94783",
        farm: "Farm A",
        price: "45.000.000 đ",
        gender: "Female",
        breed: "Shiro Utsuri",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    {
        name: "Koi KO94783",
        farm: "Farm A",
        price: "45.000.000 đ",
        gender: "Female",
        breed: "Shiro Utsuri",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    {
        name: "Koi KO94783",
        farm: "Farm A",
        price: "45.000.000 đ",
        gender: "Female",
        breed: "Shiro Utsuri",
        image: "https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
    },
    // Add more koi objects as needed
];

function KoiDetail() {
    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.koiDetailContainer}>
                <div className={styles.koiDetailLeft}>
                    <img
                        src="https://koishop.vn/admin/sanpham/t0609a007_9325_anh1.jpg?1"
                        alt="Koi Fish"
                        className={styles.koiImage}
                    />
                </div>

                <div className={styles.koiDetailRight}>
                    <h2>Koi Fish Name</h2>
                    <p><strong>Price:</strong> <span className='text-red-700 text-3xl font-semibold'>50.000.000 đ</span></p>
                    <p><strong>Breed:</strong> Kohaku</p>
                    <p><strong>Gender:</strong> Male</p>
                    <p><strong>Age:</strong> 2 years</p>
                    <p><strong>Description:</strong> Currently 2 years old and possessing a massive body for its age, thanks to a high humped back, large tail base, wide armpits, and extremely impressive and flawless scales. In about 1-2 years, it could reach a size of up to 100 cm</p>

                    <div className={styles.buttonGroup}>
                        <button className={styles.addToCartButton}>
                            <AddShoppingCartIcon /> Add to Cart
                        </button>
                        <button className={styles.buyNowButton}>Buy Now</button>
                    </div>
                </div>
            </div>

            {/* Farm Info Section */}
            <div className={styles.farmInfoContainer}>
                <div className={styles.farmAvatar}>
                    <img
                        src="https://th.bing.com/th/id/OIP.YoTUWMoKovQT0gCYOYMwzwHaHa?w=200&h=200&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                        alt="Farm Avatar"
                        className={styles.avatarImage}
                    />
                </div>
                <div className={styles.farmDetails}>
                    <h3>Farm Name</h3>
                    <p className='text-red-700'>Rating: ★★★★☆ (4.5/5)</p>
                </div>
                <button className={styles.viewFarmButton}><StoreIcon /> View Farm</button>
            </div>

            {/* Recommended Koi List Section */}
            <div className={styles.recommendedKoiContainer}>
                <h2 className={styles.recommendedKoiTitle}>Recommended Koi</h2>
                <div className="grid grid-cols-5 gap-4">
                    {kois.map((koi, index) => (
                        <div 
                            key={index} 
                            className="border p-3 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                        >
                            <img 
                                src={koi.image}
                                alt={koi.name}
                                className="mb-3 w-full h-64"
                            />
                            <h3 className="text-lg font-bold">{koi.name}</h3>
                            <p><strong>Farm:</strong> {koi.farm}</p>
                            <p><strong>Price:</strong> {koi.price}</p>
                            <p><strong>Gender:</strong> {koi.gender}</p>
                            <p><strong>Breed:</strong> {koi.breed}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KoiDetail;
