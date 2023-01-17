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
        test('Responds with a status 200', () => {
            return request(app).get('/api/reviews').expect(200)
        });
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
    });
    describe('GET /api/review/:review_id', () => {
        test('Responds with a 200 status code', () => {
            return request(app).get('/api/reviews/3').expect(200)
        });
        test('Responds with a single review object containing the correct properties', () => {
            return request(app).get('/api/reviews/3').expect(200).then((response) => {
                const review = response.body
                const expectedReview = {
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    category: 'social deduction',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_body: "We couldn't find the werewolf!",
                    review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5,
                  }
                expect(review).toEqual(expectedReview)
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
    describe('app error handling', () => {
        test('Responds with an error 404 incorrect endpoints', () => {
            return request(app).get('/api/cats').expect(404).then((response) => {
                expect(response.text).toBe('Not Found :(');
            });
        });
    });
});