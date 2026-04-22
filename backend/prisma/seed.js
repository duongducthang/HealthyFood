const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "demo@example.com";
  const password = "123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  let user = existing;

  const passwordHash = await bcrypt.hash(password, 10);
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        userName: "Demo User",
        fullName: "Demo User",
        phone: "0900000000",
        gender: "Nam",
        birthday: "2000-01-01",
        age: 24,
        province: "Hà Nội",
        district: "Ba Đình",
        address: "Demo street",
        addresses: {
          create: [
            {
              name: "Demo User",
              phone: "0900000000",
              fullAddress: "Demo street, Ba Đình, Hà Nội",
              isDefault: true,
            },
          ],
        },
      },
    });
  }

  const foodsCount = await prisma.food.count();
  if (foodsCount === 0) {
    await prisma.food.createMany({
      data: [
        {
          category: "Bữa sáng",
          title: "Potatoes",
          desc:
            "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher....",
          fullDesc:
            "Potatoes are very high in vitamin C, their skins are packed with fiber and, although they are higher in carbs, these starchy complex carbohydrates are converted into energy and will keep you feeling fuller for longer.",
          imageUrl: "Potatoes.svg",
        },
        {
          category: "Bữa trưa",
          title: "Vegetables",
          desc: "Vegetables are a great high-volume, low-calorie option...",
          fullDesc:
            "Vegetables are a great high-volume, low-calorie option. You can eat a lot of them",
          imageUrl: "Vegetables.jpg",
        },
        {
          category: "Bữa tối",
          title: "Mushrooms",
          desc: "High in protein and low in calories, mushrooms that have been grown...",
          fullDesc: null,
          imageUrl: "Mushroom.jpg",
        },
      ],
    });

    const potatoes = await prisma.food.findFirst({ where: { title: "Potatoes" } });
    if (potatoes) {
      await prisma.foodDetail.createMany({
        data: [
          { foodId: potatoes.id, name: "Baked Potato", serving: "1 piece (173g)", calories: "212" },
          { foodId: potatoes.id, name: "Croquettes", serving: "1 piece, small (19g)", calories: "34" },
          { foodId: potatoes.id, name: "Curly Fries", serving: "1 portion (85g)", calories: "150" },
          { foodId: potatoes.id, name: "French Fries", serving: "1 portion (120g)", calories: "374" },
          { foodId: potatoes.id, name: "Gnocchi", serving: "1 portion (200g)", calories: "326" },
        ],
      });
    }
  }

  const logsCount = await prisma.calorieLog.count({ where: { userId: user.id } });
  if (logsCount === 0) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;

    await prisma.calorieLog.createMany({
      data: [
        { userId: user.id, date, food: "Thịt gà", unit: "100g", qty: 100, kcal: "239" },
        { userId: user.id, date, food: "Trứng gà", unit: "100g (2 quả)", qty: 100, kcal: "155.1" },
        { userId: user.id, date, food: "Súp lơ", unit: "100g", qty: 400, kcal: "100" },
      ],
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seeded:", { user: { id: user.id, email, password } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

