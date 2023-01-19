const { app } = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const request = require('supertest')
require('jest-sorted')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe('app', () => {
    describe('GET /api/categories', () => {
        test('Responds with a 200 status code', () => {
            return request(app).get('/api/categories').expect(200)
        });
        test('Responds with an array', () => {
            return request(app).get('/api/categories').expect(200).then((response) => {
                expect(Array.isArray(response.body)).toBe(true)
            });
        });
        test('Responds with an array', () => {
            return request(app).get('/api/categories').expect(200).then((response) => {
                const categories = response.body
                categories.forEach((category) => {
                    expect(category).toHaveProperty('slug')
                    expect(category).toHaveProperty('description')
                })
            });
        });
    });
    describe('GET /api/reviews', () => {
        test('Responds with an array', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                expect(Array.isArray(response.body.reviews)).toBe(true);
            })
        })
        test('Each array item has the correct properties including comment_count', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews.length).toBe(13)
                reviews.forEach((review) => {
                    expect(review).toHaveProperty('owner')
                    expect(review).toHaveProperty('title')
                    expect(review).toHaveProperty('review_id')
                    expect(review).toHaveProperty('category')
                    expect(review).toHaveProperty('review_img_url')
                    expect(review).toHaveProperty('created_at')
                    expect(review).toHaveProperty('votes')
                    expect(review).toHaveProperty('designer')
                    expect(review).toHaveProperty('comment_count')
                })
            });
        });
        test('Comment_count returns the correct value', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                const comments3 = reviews.find(review => review.comment_count = 3)
                expect(comments3.comment_count).toBe(3)
            });
        });
        test('Response should have a default sort by created_at desc', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'created_at', descending: true})
            });
        });
        test('Accepts an order query that responds with an array of review objects now in ascending order', () => {
            return request(app).get('/api/reviews?order=ASC').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'created_at' })
            });
        });
        test('Accepts an order query that responds with an array of review objects ordered when passed in lower case order', () => {
            return request(app).get('/api/reviews?order=asc').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'created_at' })
            });
        });
        test('Responds with a 400 error and message stating that the query term is not correct when passed an order that is not ASC or DESC (either lowercase or uppercase)', () => {
            return request(app).get('/api/reviews?order=down').expect(400).then((response) => {
                expect(response.text).toBe('Bad Request - Not an accepted query')
            });
        });
        test('Accepts a sort_by query that enables the sort to be modified from the default of created_at', () => {
            return request(app).get('/api/reviews?sort_by=review_id').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'review_id', descending: true })
            });
        });
        test('Responds with a 400 error and message stating that the query term is not correct when passed a sort_by term that is not accepted', () => {
            return request(app).get('/api/reviews?sort_by=reviewer').expect(400).then((response) => {
                expect(response.text).toBe('Bad Request - Not an accepted query')
            });
        });
        test('Sort_by and order query parameters work in conjunction with eachother', () => {
            return request(app).get('/api/reviews?sort_by=title&order=asc').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'title' })
            });
        });
        test('Accepts a category query that responds with an array of review objects that correspond to the given category ', () => {
            return request(app).get('/api/reviews?category=dexterity').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews.length).toBe(1)
                reviews.forEach(review => {
                    expect(review.category).toBe("dexterity")
                })
            });
        });
        test('Accepts a category query that contains spaces - responds with an array of review objects that correspond to the given category', () => {
            return request(app).get('/api/reviews?category=social+deduction').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews.length).toBe(11)
                reviews.forEach(review => {
                    expect(review.category).toBe("social deduction")
                })
            });
        });
        test('Responds with an empty array if the given category has no corresponding reviews', () => {
            return request(app).get('/api/reviews?category=children\'s+games').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews.length).toBe(0)
            });
        });
        test('Responds with 400 error bad request if the category does not currently exist in the database', () => {
            return request(app).get('/api/reviews?category=ideas').expect(400).then((response) => {
               expect(response.text).toBe("Category not found :(")
            });
        });
    });
    describe('GET /api/review/:review_id', () => {
        test('Responds with a single review object containing the correct properties', () => {
            return request(app).get('/api/reviews/3').expect(200).then((response) => {
                const review = response.body
                const expectedReview = {
                        review_id: 3,
                        title: 'Ultimate Werewolf',
                        designer: 'Akihisa Okui',
                        owner: 'bainesface',
                        review_img_url:
                          'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                        review_body: "We couldn't find the werewolf!",
                        category: 'social deduction',
                        created_at: expect.any(String),
                        votes: 5
                }
                expect(review).toMatchObject(expectedReview)
            });
        });
        test('Responds with a single review object containing the correct properties', () => {
            return request(app).get('/api/reviews/3').expect(200).then((response) => {
                const review = response.body
                expect(review).toHaveProperty('comment_count')
                expect(review.comment_count).toBe("3")
            });
        });
        test('Responds with a 404 error not found when passed an ID that does not currently exist within the db', () => {
            return request(app).get('/api/reviews/9999').expect(404).then((response) => {
                expect(response.text).toBe('id Not Found!')
            });
        });
        test('Responds with a 400 error bad request when passed an ID that is of an incorrect data type', () => {
            return request(app).get('/api/reviews/abc').expect(400).then((response) => {
                expect(response.text).toBe('Bad Request!')
            });
        });
    });
    describe('GET /api/reviews/:review_id/comments', () => {
        test('Responds with an array', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(Array.isArray(comments)).toBe(true)
            })
        });
        test('Response array contains comment objects with the relevant comment keys', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments.length).toBe(3)
                comments.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment).toHaveProperty('review_id')
                })
            });
        });
        test('Responds with a 400 error bad request when passed a review_id that is of the wrong data type', () => {
            return request(app).get('/api/reviews/abc/comments').expect(400).then(response => {
                expect(response.text).toBe("Bad Request!")
            });
        });
        test('Responds with a 404 error not found when passed a review_id that is not currently within the db', () => {
            return request(app).get('/api/reviews/9999/comments').expect(404).then(response => {
                expect(response.text).toBe("id Not Found!")
            });
        });
        test('Responds with a status 200 and an empty array when passed a review_id that exists but has no comments associated with it', () => {
            return request(app).get('/api/reviews/1/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments).toEqual([])
            })
        });
        test('Comments are orderd by created_at by default newest comment first', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments).toBeSorted({ key: 'created_at', descending: true})
            })
        });
    });
    describe('POST request to /api/reviews/:review_id/comments', () => {
        test('Responds status 201 and returns the newly created comment', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'bainesface', body: "This is a review"})
            .expect(201)
            .then(response => {
                const newComment = response.body.newComment
                const expectedComment = {
                    review_id: 1,
                    comment_id: expect.any(Number),
                    author: 'bainesface',
                    body: "This is a review",
                    created_at: expect.any(String),
                    votes: 0
                }
                expect(newComment).toMatchObject(expectedComment)
            })
        });
        test('Database - comments table is updated with the new comment', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'bainesface', body: "This is a review"})
            .expect(201)
            .then(() => {
                return request(app).get('/api/reviews/1/comments').expect(200).then((response) => {
                    const comments = response.body.comments
                    expect(comments.length).toBe(1)
                })
            })
        });
        test('Responds status 400 - username does not exist', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'Stacey123', body: "This is a review too"})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('username does not exist!')
            })
        });
        test('Responds status 400 bad request when passed a review_id that is not the correct data type', () => {
            return request(app).post('/api/reviews/abc/comments')
            .send({ username: 'mallionaire', body: "This is a review three"})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request!')
            })
        });
        test('Responds status 400 bad request when passed a request body that is empty', () => {
            return request(app).post('/api/reviews/3/comments')
            .send({})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request - request body is lacking the required fields!')
            })
        });
        test('Responds status 400 bad request when passed a request body that has the invalid fields', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({votes: 20})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request - request body is lacking the required fields!')
            })
        });
        test('Responds status 404 not found when passed a review_id that is not currently in the data', () => {
            return request(app).post('/api/reviews/9999/comments')
            .send({ username: 'mallionaire', body: "This is a review four"})
            .expect(404)
            .then(response => {
                expect(response.text).toBe('id Not Found!')
            })
        });
    });
    describe('PATCH /api/reviews/:review_id', () => {
        test('Responds 200 OK and sends back the updated review for positive numbers in the inc_votes', () => {
            return request(app).patch('/api/reviews/3')
            .send({ inc_votes: 100})
            .expect(200)
            .then((response) => {
                const updatedReview = response.body.updatedReview
                const expectedReview = {
                    review_id: 3,
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: 105
                    }
                expect(updatedReview).toMatchObject(expectedReview)
                });
        });
        test('Responds 200 OK and sends back the updated review for negative numbers in the inc_votes', () => {
            return request(app).patch('/api/reviews/1')
            .send({ inc_votes: -100})
            .expect(200)
            .then((response) => {
                const updatedReview = response.body.updatedReview
                const expectedReview = {
                    review_id: 1,
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: -99
                }
                expect(updatedReview).toMatchObject(expectedReview);
            });
        });
        test('Update votes works when used multiple times', () => {
            return request(app).patch('/api/reviews/1')
            .send({ inc_votes: -100})
            .expect(200)
            .then(() => {
                return request(app).patch('/api/reviews/1').send({inc_votes: 50}).expect(200)
                .then((response) => {
                    const updatedReview = response.body.updatedReview
                    const expectedReview = {
                        review_id: 1,
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_body: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: -49
                    }
                    expect(updatedReview).toMatchObject(expectedReview);
                });
            })
        });
        test('Responds 400 Bad Request! when passed an empty request body', () => {
            return request(app).patch('/api/reviews/3')
            .send({})
            .expect(400)
            .then((response) => {            
                expect(response.text).toBe("Bad Request - request body is lacking the required fields!")
                });
        });
        test('Responds 400 Bad Request! when passed a request body with invalid patch fields', () => {
            return request(app).patch('/api/reviews/3')
            .send({ review_body: "Hello" })
            .expect(400)
            .then((response) => {            
                expect(response.text).toBe("Bad Request - request body is lacking the required fields!")
                });
        });
        test('Responds 400 Bad Request! when passed a request body with inc_votes containing invalid data types', () => {
            return request(app).patch('/api/reviews/3')
            .send({ inc_votes: "abc" })
            .expect(400)
            .then((response) => {            
                expect(response.text).toBe("Bad Request!")
                });
        });
        test('Responds 400 Bad Request! when passed a review id containing invalid data types', () => {
            return request(app).patch('/api/reviews/abc')
            .send({ inc_votes: 4 })
            .expect(400)
            .then((response) => {            
                expect(response.text).toBe("Bad Request!")
                });
        });
        test('Responds 404 id not found! when passed a review id that does not currently exist', () => {
            return request(app).patch('/api/reviews/9999')
            .send({ inc_votes: 4 })
            .expect(404)
            .then((response) => {            
                expect(response.text).toBe("id Not Found!")
                });
        });
    });
    describe('GET /api/users', () => {
        test('Responds 200 and returns an array', () => {
            return request(app).get('/api/users').expect(200).then((response) => {
                const users = response.body.users
                expect(Array.isArray(users)).toBe(true);
            })
        })
        test('Users array items are objects with keys for username, name and avatar_url', () => {
            return request(app).get('/api/users').expect(200).then((response) => {
                const users = response.body.users
                expect(users.length).toBe(4)
                users.forEach(user => {
                    expect(user).toHaveProperty('username')
                    expect(user).toHaveProperty('name')
                    expect(user).toHaveProperty('avatar_url')
                })
            })
        })
    });
    describe('DELETE /api/comments/:comment_id', () => {
        test('Delete request responds with a 204 status - no content', () => {
            return request(app).delete('/api/comments/1').expect(204)
        });
        test('Comment is successfully removed from the database', () => {
            return request(app).delete('/api/comments/1').expect(204).then(() => {
                return request(app).get('/api/reviews/2/comments').expect(200).then((response) => {
                    const comments = response.body.comments
                    const commentWithIdOf1 = comments.filter((comment) => comment.comment_id === 1)
                    expect(commentWithIdOf1.length).toBe(0)
                })
            })
        });
        test('responds with 400 - bad request when passed a comment_id that is the wrong datatype', () => {
            return request(app).delete('/api/comments/abc').expect(400).then(response => {
                expect(response.text).toBe('Bad Request!')
            })
        })
        test('responds with 404 - not found when passed a comment_id that does not exist', () => {
            return request(app).delete('/api/comments/999').expect(404).then(response => {
                expect(response.text).toBe('comment_id not found')
            })
        })
    });
    describe('app error handling', () => {
        test('Responds with an error 404 incorrect endpoints', () => {
            return request(app).get('/api/cats').expect(404).then((response) => {
                expect(response.text).toBe('Not Found :(');
            });
        });
    });
});