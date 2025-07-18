<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>COFFICE</title>
<link href="/images/3.png" rel="shortcut icon" type="image/x-icon">
<c:import url="/WEB-INF/views/templates/header.jsp"></c:import>
<script type="module"
	src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule
	src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body id="page-top">
	<div id="wrapper">
		<c:import url="/WEB-INF/views/templates/sidebar.jsp"></c:import>
		<div id="content-wrapper" class="d-flex flex-column">
			<div id="content">
				<c:import url="/WEB-INF/views/templates/top.jsp"></c:import>
				<div class="container-fluid">
					<!-- <h2 class="mb-2 text-gray-800">공지사항</h2> -->
					<!-- contents 내용 -->
					<div class="d-flex flex-column">

						<div class="card mb-4 py-2 border-left-danger">
							<div class="card-body">${detail.noticeTitle }</div>
						</div>

						<div class="card shadow mb-3" style="min-height: 600px;">
							<div class="card-header py-3">
								<h6 class="m-0 font-weight-bold text-primary">작성일:
									${detail.formatted }</h6>
								<%-- <h6 class="m-0 font-weight-bold text-primary">조회수:
									${detail.noticeHit }</h6> --%>
							</div>
							<div class="card-body">${detail.noticeContents }</div>
						</div>
						<div class="card shadow mb-4">
							<div class="card-header py-3">
								<h6 class="m-0 font-weight-bold text-primary">첨부파일</h6>
							</div>
							<div class="card-body">
								<c:forEach items="${detail.files }" var="l">
									<a href="./fileDown?fileNum=${l.fileNum }" class="mr-1">${l.originName }</a>
								</c:forEach>
							</div>
						</div>

						<sec:authorize access="hasRole('ADMIN')">
							<div class="mb-2 ml-auto">
								<button class="btn btn-danger" id="delBtn" type="button"
									data-notice-num="${detail.noticeNum }">삭제하기</button>
								<a href="./update?noticeNum=${detail.noticeNum }"
									class="btn btn-primary">수정하기</a>
							</div>
						</sec:authorize>
					</div>
				</div>
				<!-- end Content -->
				<c:import url="/WEB-INF/views/templates/foot.jsp"></c:import>
			</div>
			<!-- End Content Wrapper -->
		</div>
		<!-- End Wrapper -->
		<script src="/js/posts/noticeDetail.js"></script>
		<c:import url="/WEB-INF/views/templates/footModal.jsp"></c:import>
</body>
</html>