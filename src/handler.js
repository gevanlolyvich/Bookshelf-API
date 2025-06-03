const { nanoid } = require('nanoid');
const books = require('./books');

const addBookhandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    } 
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    } 

    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if ( isSuccess ) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            }
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            status: "fail",
            message: "Buku Gagal ditambahkan"
        });
        response.code(500);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if (name) {
        const book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: "success",
            data: {
                books: book.map((b) => ({
                    id: b.id,
                    name: b.name,
                    publisher: b.publisher
                }))
            }
        });
        response.code(200);
        return response;
    };

    if (reading !== undefined) {
        const readBook = books.filter((n) => n.reading === (reading === '1'));
        const response = h.response({
            status: 'success',
            data: {
                books: readBook.map((r) => ({
                    id: r.id,
                    name: r.name,
                    publisher: r.publisher
                }))
            }
        });
        response.code(200);
        return response;
    };

    if (finished !== undefined) {
        const finishedBook = books.filter((n) => n.finished === (finished === '1'));
        const response = h.response({
            status: 'success',
            data: {
                books: finishedBook.map((fin) => ({
                    id: fin.id,
                    name: fin.name,
                    publisher: fin.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }

    return {
        status: "success",
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    };
}

const getSpecificBookHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((n) => n.id === bookId);

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        });
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: "Buku tidak ditemukan"
    });
    response.code(404);
    return response;
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { 
        name, 
        year, 
        author, 
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const bookById = books.findIndex((book) => book.id === bookId);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    } else if (bookById !== -1) {
        books[bookById] = {
            ...books[bookById],
            name, 
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const indexBook = books.findIndex((book) => book.id === bookId);
    
    if (indexBook !== -1) {
        books.splice(indexBook, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBookhandler, 
    getAllBooksHandler, 
    getSpecificBookHandler, 
    updateBookByIdHandler, 
    deleteBookByIdHandler,
 };
