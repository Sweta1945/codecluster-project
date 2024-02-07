// data.js
const generateData = () => {
    const data = [];
    for (let i = 1; i <= 50; i++) {
      data.push({
        id: i,
        name: `Name ${i}`,
        age: Math.floor(Math.random() * 50) + 18, // Generate random age between 18 and 67
        salary: Math.floor(Math.random() * 100000) + 40000, // Generate random salary between 40,000 and 139,999
        department: `Department ${Math.floor(Math.random() * 5) + 1}` // Generate random department
      });
    }
    return data;
  };
  
  export default generateData();
  