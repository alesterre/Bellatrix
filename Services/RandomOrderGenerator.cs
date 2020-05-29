using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bellatrix.Model;

namespace bellatrix.Services
{
    public static class RandomOrderGenerator
    {
        private static readonly string[] ClientFirstNames = {"Bill", "Katie", "Peter", "James", "Edwin", "Lily", "Elon"};
        private static readonly string[] ClientLastNames = { "Smith", "Farber", "Rock", "Everson", "Crawford", "Woo", "Musk" };

        private static readonly string[] DescriptionPartOne = { "Good", "Bright", "Big", "Funny", "Awesome", "Clever", "Useful" };
        private static readonly string[] DescriptionPartTwo = { "black", "white", "orange", "blue", "green", "red", "violet" };
        private static readonly string[] DescriptionPartThree = { "dog food", "books", "car", "house", "pony", "kitchen table", "rocket" };


        public static Order GenerateRandomOrder()
        {
            var rnd = new Random();
            
            var clientFirstName = ClientFirstNames[rnd.Next(0, ClientFirstNames.Length - 1)];
            var clientLastName = ClientLastNames[rnd.Next(0, ClientLastNames.Length - 1)];

            var descriptionPartOne = DescriptionPartOne[rnd.Next(0, DescriptionPartOne.Length - 1)];
            var descriptionPartTwo = DescriptionPartTwo[rnd.Next(0, DescriptionPartTwo.Length - 1)];
            var descriptionPartThree = DescriptionPartThree[rnd.Next(0, DescriptionPartThree.Length - 1)];

            return new Order
            {
                DateCreated = DateTime.Now.AddDays(-30 * rnd.NextDouble()),
                ClientName = $"{clientFirstName} {clientLastName}",
                Description = $"{descriptionPartOne} {descriptionPartTwo} {descriptionPartThree}",
                TotalPrice = (decimal)(Math.Round(rnd.Next(0, 10000) * rnd.NextDouble() * rnd.NextDouble()) + 0.01 * rnd.Next(0,99))
            };
        }
    }
}
