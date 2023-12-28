// Importez les modules nécessaires de React
import React from 'react';
import Image from 'next/image';


const randomColor = () => {
    const colors = [
        'text-red-400',
        'text-yellow-400',
        'text-green-400',
        'text-blue-400',
        'text-indigo-400',
        'text-purple-400',
        'text-pink-400',
        'text-red-800',
        'text-yellow-800',
        'text-green-800',
        'text-blue-800',
        'text-indigo-800',
        'text-purple-800',
        'text-pink-800',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

const rankImg = (rank) => {
    if (rank === 1) {
        return '/images/icon/gold.png';
    } else if (rank === 2) {
        return '/images/icon/silver.png';
    } else if (rank === 3) {
        return '/images/icon/bronze.png';
    } else {
        return '/images/icon/poop.png';
    }
};

export const rankTitle = (rank) => {
    if (rank === 1) {
        return 'Le jardinier Originel';
    } else if (rank === 2) {
        return 'Vise la lune mais atterit dans la merde';
    } else if (rank === 3) {
        return 'Même en rateau il est mauvais.';
    } else {
        return '';
    }
}


// Définissez le composant Ranking
const Ranking = ({ user, rank }) => {
    return (
    <div className="bg-white py-3 px-6 my-3 rounded-lg shadow-lg flex flex-row items-center justify-between">
        <div>
            <Image 
                src={rankImg(rank)} 
                width={50}
                height={50}
            />
            <Image 
                className="rounded-full ml-20"
                src={user.userImage} 
                width={50}
                height={50}
            />
        </div>
        
        <div className="ranking-name flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 h-fit">{user.userName}</h2>
            <p className=" text-gray-600 h-fit">{rankTitle(rank)}</p>
        </div>
        <p className={`${randomColor()} text-2xl text-gray-800 font-bold h-fit`}>{user.numberOfPublishedPosts}</p>
    </div>
    );
};

// Exportez le composant pour l'utiliser ailleurs
export default Ranking;