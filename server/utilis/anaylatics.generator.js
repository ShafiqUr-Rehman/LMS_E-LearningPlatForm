// In "anaylatics.generator.js"
async function generateLast12MonthsData(model) {
    const last12Months = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
  
    for (let i = 11; i >= 0; i--) {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 28
      );
  
      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
      last12Months.push({
        month: monthYear,
        count: count,
      });
    }
    return { last12Months };
  }
  
  export { generateLast12MonthsData };
  