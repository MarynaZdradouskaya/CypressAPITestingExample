/// <reference types="cypress" />




describe('Test with backend', () => {

 beforeEach('Login to the App', () => {
    cy.intercept('GET', Cypress.env('apiUrl')+'api/tags', {fixture: 'tags.json'})
    cy.intercept({method:'Get', path: 'tags'}, {fixture: 'tags.json'} )
    cy.loginToApplication()
 })
 
  it('verify correct request and response', () => {

    //cy.intercept('POST', Cypress.env('apiUrl')+'api/articles', (req) => {
      //req.body.article.description = 'This is the description 2'
    //}).as('postArticles')

    
    cy.intercept('POST', Cypress.env('apiUrl')+'api/articles', (req) => {
      req.reply( res => {
        expect(res.body.article.description).to.equal('This is the description')
        res.body.article.description = "This is the description 2"
      })
    }).as('postArticles')


    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is the description')
    cy.get('[formcontrolname="body"]').type('This is the body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('This is the body of the article')
      //expect(xhr.response.body.article.body).to.equal('This is the body of the article')
      expect(xhr.response.body.article.description).to.equal('This is the description 2')
    })
  })


  it('intercepting and modifying the request and response', () => {

    cy.intercept('POST', Cypress.env('apiUrl')+'api/articles').as('postArticles')

    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is the description')
    cy.get('[formcontrolname="body"]').type('This is the body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('This is the body of the article')
      expect(xhr.response.body.article.body).to.equal('This is the body of the article')
    })
  })
  it.only('verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'cypress')
    .and('contain', 'automation')
    .and('contain', 'sea')
    .and('contain', 'sun')

  })
  it('verify global feed likes count', () =>{
    cy.intercept('GET', Cypress.env('apiUrl')+'api/articles/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', Cypress.env('apiUrl')+'api/articles*', {fixture: 'articles.json'})

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then( heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
      expect(heartList[2]).to.contain('10000')

    })
    cy.fixture("articles").then( file => {
     const articleLink = file.articles[1].slug
     file.articles[1].favoritesCount = 6
     cy.intercept('POST', Cypress.env('apiUrl')+'api/articles/'+articleLink+'/favorite', file)
    })
    
    cy.get('app-article-list button').eq(1).click().should('contain', '6')
  })

  it('delete a new article in a global feed', () => {

    const userCredentials = {
      
        "user": {
            "email": "zdr.bona",
            "password": "CypressTest1"
        
    }
    }

    const bodyRequest = {
      "article": {
          "tagList": [],
          "title": "Request from API",
          "description": "API testing is easy",
          "body": "Cypress is cool"
      }
  }
 

   cy.request('POST', Cypress.env('apiUrl')+'api/users/login', userCredentials)
   .its('body').then( body => {
    const token = body.user.token

    cy.request({
      url: Cypress.env('apiUrl')+'api/articles/',
      headers: {'Autorization': 'Token '+token},
      method: 'POST',
      body: bodyRequest      
    }).then( response => {
      expect(response.status).to.equal(200)
    } )
       })
  })

})
