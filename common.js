const apiUrl = "https://api.autoyycompany.com";

<!--Start of Tawk.to Script-->

var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/68980713e0fd9f192a10fd60/1j28ut8gc';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();

<!--End of Tawk.to Script-->

const common = {
    ready: function () {
        document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('navMenu');

            if (!hamburger || !navMenu) return;

            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });

            // 외부 클릭 시 메뉴 닫기
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('show');
                }
            });


            const isLogin = sessionStorage.getItem("isLogin", "Y") || "N";
            if (isLogin === 'Y') {
                document.querySelectorAll('.signout-element').forEach(el => el.style.display = 'block');
                document.querySelectorAll('.signin-element').forEach(el => el.style.display = 'none');
            } else {
                document.querySelectorAll('.signout-element').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.signin-element').forEach(el => el.style.display = 'block');
            }


            const userLevel = sessionStorage.getItem('userLevel');
            if ((userLevel * 1) >= 8) {
                if (document.querySelector('.nav-acount')) {
                    document.querySelector('.nav-acount').style.display = '';
                }

                if (document.querySelector('.account-list-area')) {
                    document.querySelector('.account-list-area').style.display = '';
                }
            }
			
        });
    },

    getApiUrl: () => {
        return apiUrl;
    },

    requestAPI: ({
                     url,
                     method = 'GET',
                     data = null,
                     headers = {},
                     timeout = 15000,
                     withCredentials = false,
                     onSuccess = function () {
                     },
                     onError = function () {
                     }
                 }) => {
        const upper = method.toUpperCase();
        let fullUrl = `${apiUrl}${url}`;

        // GET 쿼리스트링
        if (upper === 'GET' && data) {
            const qs = new URLSearchParams(data).toString();
            if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
        }

        // 🔹 토큰 가져오기
        const token = sessionStorage.getItem('sessionToken');

        // 기본 헤더 + 토큰 추가
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const opts = {
            method: upper,
            headers: defaultHeaders,
            credentials: withCredentials ? 'include' : 'same-origin'
        };

        if (upper !== 'GET' && data) {
            opts.body = data instanceof FormData ? data : JSON.stringify(data);
        }

        // 타임아웃
        const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        if (ctrl) {
            opts.signal = ctrl.signal;
            setTimeout(() => ctrl.abort(), timeout);
        }

        fetch(fullUrl, opts)
            .then(res => res.text().then(t => {
                let parsed = t;
                try {
                    parsed = JSON.parse(t);
                } catch {
                }

                // 🔹 401 Unauthorized 처리
                if (res.status === 401) {
                    const isLogin = sessionStorage.getItem('isLogin') === 'Y' ? true : false;

                    if( isLogin ){
                        sessionStorage.clear();
                        window.location.href = "index.html";
                    }

                }

                if (res.ok) {
                    onSuccess(parsed);
                } else {
                    onError(new Error((parsed && parsed.message) || `API 요청 실패 (${res.status})`));
                }
            }))
            .catch(err => onError(err.name === 'AbortError' ? new Error('요청 시간 초과') : err));
    }

    ,


    /**
     * ISO 날짜 문자열 또는 Date 객체를 YYYY-MM-DD HH:mm:ss 형식(로컬 시간)으로 변환
     * @param {string|Date} input - ISO 문자열("2025-07-27T07:44:37.000Z") 또는 Date 객체
     * @returns {string} 포맷된 날짜 문자열 (로컬 시간)
     */
    formatLocalDateTime: function (input) {
        const date = input instanceof Date ? input : new Date(input);

        const pad = n => (n < 10 ? '0' + n : n);

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0부터 시작하므로 +1
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
    },

    getGender: function (genderCode) {
        switch (genderCode) {
            case 'male':
                return '남성';
            case 'female':
                return '여성';
            case 'other':
                return '기타';
            default:
                return '선택 안 함'; // NULL이나 빈 값일 때
        }
    }
    ,

    signout: () => {
        sessionStorage.clear();
        window.location.href = "index.html";
    },

}

window.comm = common;