import * as $ from "jquery";
import * as ko from "knockout";
import { Route, Router } from "@profiscience/knockout-contrib-router";

const loading = ko.observable(true);

Router.setConfig({
  base: "/testing",
  hashbang: false,
  activePathCSSClass: "active-path"
});

Router.useRoutes([
  new Route("/", "home"),
  new Route("/users", [new Route("/", "users"), new Route("/:id", "user")])
]);

ko.components.register("home", {
  template: `<a data-bind="path: '/testing/users'">Show users</a>`
});

const users = [{ id: 1, name: "Carlos" }, { id: 2, name: "Ricardo" }];

ko.components.register("users", {
  viewModel: class UsersViewModel {
    constructor(ctx) {
      debugger;
      this.users = users;
    }

    navigateToUser(user) {
      Router.update("/testing/users/" + user.id, { with: { user } });
    }
  },
  template: `
    <ul data-bind="foreach: users">
      <span data-bind="text: name, click: $parent.navigateToUser"></span>
    </ul>
  `
});

ko.components.register("user", {
  viewModel: class UserViewModel {
    constructor(ctx) {
      this.user = ctx.user;
    }
  },
  template: '<span data-bind="text: user.name"></span>'
});

setTimeout(() => loading(false), 100);

ko.applyBindings({ loading });
