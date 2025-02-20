namespace Bookstore;

entity Books
{
    key ID:UUID;
    title:String;
    author:String;
    price:Decimal;
    stock:Integer;
   
}
