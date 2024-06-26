<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en" id="html">

<head>
    <title>jump</title>
    <meta name="keywords" content="jump" />
    <meta name="description" content="jump" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <script type="text/javascript" src="js/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="../js/common.js"></script>
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
        }

        html,
        body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #edffd9;
        }

        #game {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
        }

        canvas {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
        }

        #forhorview {
            position: absolute;
            font-size: 0.5rem;
            text-align: center;
            line-height: 100%;
            color: #6c6f3a;
            background: #edffd9;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 100;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            -webkit-justify-content: center;
            justify-content: center;
        }
    </style>
</head>

<body>
    <div id="game"></div>
    <div id="forhorview">로딩중 ...</div>
</body>

</html>