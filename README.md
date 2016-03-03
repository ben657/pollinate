---
layout: default
permalink: /
---

# Pollinate

```
$ npm install -g pollinate
```

[![Join the chat at https://gitter.im/everysquare/pollinate](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/everysquare/pollinate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![npm version](https://badge.fury.io/js/pollinate.svg)](https://badge.fury.io/js/pollinate)  [![Build Status](https://travis-ci.org/everysquare/pollinate.svg?branch=master)](https://travis-ci.org/everysquare/pollinate) [![Coverage Status](https://coveralls.io/repos/github/everysquare/pollinate/badge.svg?branch=master)](https://coveralls.io/github/everysquare/pollinate?branch=master) [![Dependency Status](https://david-dm.org/everysquare/pollinate.svg)](https://david-dm.org/everysquare/pollinate)

## What?

It is a command that takes two arguments, the first is the GitHub user/template
and the second is a data source (string, file, url, or cli options). The data specifies
a `name`, `context`, files to `discard`, files to `parse` with the `context`,
and files to `move` or rename. The template supplies default data as
`template.json`, which is extended by the data source. The `name` value is used
to name the output directory, and is also available in the template `context`.

All templates are parsed with [Nunjucks](http://mozilla.github.io/nunjucks/) aka
[Jinja](http://jinja.pocoo.org/) and [Twig](http://twig.sensiolabs.org/). All JSON
is parsed with [Hjson](http://hjson.org), so you can use comments!

## Why?

When starting new projects the quickest way is often to just copy the last project and
fiddle with it until it works. This can introduce many unwanted issues, like having one
client's name appear in place of the other's. There are tools like [Yeoman](http://yeoman.io)
which allow you to build your own scaffolding engines, but not every case requires that
amount of complexity.

This project's goal is to offer a elegant way of working with a base set of files that
can be understood by looking at a single example.

## An example

```
$ pollinate everysquare/example '{"name":"everysquare","context":{"container":"alpine"}}'
```
[Skip to more examples...](#more-examples)

##### The repository

```
.
├── PROJECT-README
├── README.md
├── Dockerfile
├── project-name
└── template.json
```

##### The `template.json` data and files to `parse` within the repository

```
{
  "name": "newproject",
  "context": {
    "container": "debian"
  },
  "discard": [
    "README.md",
    "template.json"
  ],
  "parse": [
    "PROJECT-README",
    "Dockerfile"
  ],
  "move": [
    { "PROJECT-README": "README.md" },
    { "project-name": "{{ name }}.txt" }
  ]
}
```

###### `PROJECT-README`

```
# {{ name }}
```

###### `Dockerfile`

```
FROM {{ container }}
```

##### The resulting object after extending and parsing

```
{
  "name": "everysquare",
  "context": {
    "container": "alpine"
  },
  "discard": [
    "README.md",
    "template.json"
  ],
  "parse": [
    "Dockerfile",
    "PROJECT-README"
  ],
  "move": [
    { "PROJECT-README": "README.md" },
    { "project-name": "everysquare.txt" }
  ]
}
```

##### The resulting file tree output

```
.
└── everysquare
   ├── README.md
   ├── everysquare.txt
   └── Dockerfile
```

###### `README.md`

```
# everysquare
```

###### `Dockerfile`

```
FROM alpine
```

## More examples

You can set `name` and `context` properties as CLI options
```
$ pollinate everysquare/example --name everysquare --container ubuntu
```

You can specify template files as a local directory (.git will be removed)
```
$ pollinate ./example --name everysquare --container ubuntu
```

You can use any Git url (.git will be removed)
```
$ pollinate https://github.com/everysquare/example.git --name everysquare --container ubuntu
```

You can pass the data as a file
```
$ pollinate everysquare/example data.json
```

You can pass the data as a JSON endpoint
```
$ pollinate everysquare/example https://raw.githubusercontent.com/everysquare/pollinate/master/tests/data.json
```

You can self-pollinate from the default data in the template
```
$ pollinate everysquare/example
```

You can override `name` and `context` properties as CLI options
```
$ pollinate everysquare/example ~/defaults.json --name=alternate --container=ubuntu
```

You can specify a command to run on completion
```
{
  "complete": "git init {{ name }}"
}
```

