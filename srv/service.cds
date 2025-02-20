using Bookstore as book from '../db/schema';

service CatalogService 
{
    entity Books as projection on book.Books
}

