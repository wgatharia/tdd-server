import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import db from './db';
import { app } from './server'

describe('GET /users:username', () => {
    it('sends correct response when a user with the username is found', async () => {
        const fakeData = {
            id: '123',
            username: 'abc',
            email: 'abc@gmail.com'
        };

        const stub = sinon
            .stub(db, 'getUserByUsername')
            .resolves(fakeData);

        //validate the request returns correct status code, content type and data
        await request(app).get('/users/abc')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(fakeData);

        //ensure on the first call of stub calls the first argument will be abc
        expect(stub.getCall(0).args[0]).to.equal('abc');
        stub.restore();
    })

    it('sends the correct response when there is an error', async () =>{
        const fakeError = { message: 'Something went wrong'}
        const stub = sinon.stub(db, 'getUserByUsername')
            .throws(fakeError);

        await request(app).get('/users/abc')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(fakeError);
        
        stub.restore();
    })

    it('returns appropriate reponse when the user is not found', async () => {
        
        const stub = sinon.stub(db, 'getUserByUsername')
                    .resolves(null);

        await request(app).get('/users/abc')
            .expect(404);
                    
        stub.restore();
    
    })
})