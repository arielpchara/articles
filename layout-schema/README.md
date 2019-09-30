*[DRAFT]*
---

# Layout Schema

## Principles

- Statelessness
- Test interface
- Schema Components

### Whats Statelessness

> Statelessness means that every HTTP request happens in complete isolation. When the client makes an HTTP request, it includes all information necessary for the server to fulfill that request. The server never relies on information from previous requests. If that information was important, the client would have sent it again in this request.

Web application is an http-response-like

URL must have all information to build the same interface in different browsers and sessions, respecting user permissions, of course.

These Schemas can validade the interface.

## Router based application
`