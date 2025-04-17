

export const getHouseImage = (index) => {
    const images = [
      require('../assets/Images/houses/back-left-corner.png'),   // 0
      require('../assets/Images/houses/back.png'),               // 1
      require('../assets/Images/houses/back-right-corner.png'),  // 2
      require('../assets/Images/houses/side-left.png'),          // 3
      require('../assets/Images/houses/side-right.png'),         // 4
      require('../assets/Images/houses/front-left-corner.png'),  // 5
      require('../assets/Images/houses/front.png'),              // 6
      require('../assets/Images/houses/front-right-corner.png'), // 7
    ];
  
    return images[index] ?? images[4]; // Default to front
  };