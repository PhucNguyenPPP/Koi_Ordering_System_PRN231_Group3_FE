import HomeSlider from "./HomeSlider";

const kois = [
    { name: "Koi 1", farm: "Farm A", price: "$100", gender: "Male", breed: "Breed A" },
    { name: "Koi 2", farm: "Farm B", price: "$120", gender: "Female", breed: "Breed B" },
    { name: "Koi 3", farm: "Farm C", price: "$150", gender: "Male", breed: "Breed C" },
    { name: "Koi 4", farm: "Farm D", price: "$130", gender: "Female", breed: "Breed D" },
    { name: "Koi 5", farm: "Farm E", price: "$110", gender: "Male", breed: "Breed E" },
    { name: "Koi 6", farm: "Farm F", price: "$140", gender: "Female", breed: "Breed F" },
    { name: "Koi 7", farm: "Farm G", price: "$160", gender: "Male", breed: "Breed G" },
    { name: "Koi 8", farm: "Farm H", price: "$180", gender: "Female", breed: "Breed H" },
    { name: "Koi 9", farm: "Farm I", price: "$190", gender: "Male", breed: "Breed I" },
    { name: "Koi 10", farm: "Farm J", price: "$200", gender: "Female", breed: "Breed J" }
];

function Home() {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="pt-10 pb-10">
                <div className="flex justify-center mb-10">
                    <div className="w-3/4">
                        <HomeSlider />
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <div className="w-3/4">
                        <div className="grid grid-cols-5 gap-4">
                            {kois.map((koi, index) => (
                                <div
                                    key={index}
                                    className="border p-3 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                                >
                                    <img
                                        src="https://koishop.vn/images/image.php?width=270&image=/admin/sanpham/t0609a007_9325_anh1.jpg"
                                        alt={koi.name}
                                        className="mb-3 w-full h-64 object-cover" // Thêm object-cover để hình ảnh không bị méo
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
            </div>

        </div>
    );
}

export default Home;
