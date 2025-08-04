document.addEventListener('DOMContentLoaded', function () {
    // --- RESPONSIVE NAVIGATION ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // --- IMAGE CAROUSEL ---
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('carousel-next');
        const prevButton = document.getElementById('carousel-prev');
        const dotsNav = document.getElementById('carousel-dots');
        let slideWidth = slides.length > 0 ? carousel.getBoundingClientRect().width : 0;
        let currentIndex = 0;
        let autoPlayInterval;

        const moveToSlide = (targetIndex) => {
            if (slides.length === 0) return;
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots();
        };
        
        const updateDots = () => {
            if (dots.length === 0) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-white', index === currentIndex);
            });
        };
        
        const setSlidePositions = () => {
            if (slides.length === 0) return;
            slideWidth = carousel.getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.width = slideWidth + 'px';
            });
            moveToSlide(currentIndex);
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white/50', 'hover:bg-white', 'transition');
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetAutoPlay();
            });
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        nextButton.addEventListener('click', () => {
            if (slides.length === 0) return;
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
            resetAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            if (slides.length === 0) return;
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
            resetAutoPlay();
        });
        
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                if (slides.length === 0) return;
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 5000); // Change slide every 5 seconds
        };
        
        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        window.addEventListener('resize', setSlidePositions);
        
        // Initial setup
        setSlidePositions();
        updateDots();
        startAutoPlay();
    }

    // --- DYNAMIC COPYRIGHT YEAR ---
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }

    // --- GEMINI AI ESTIMATOR ---
const estimateButton = document.getElementById('estimate-button');
const projectDescription = document.getElementById('project-description');
const estimatorResult = document.getElementById('estimator-result');
const loadingIndicator = document.getElementById('loading-indicator');
const resultContent = document.getElementById('result-content');

if (estimateButton && projectDescription && estimatorResult && loadingIndicator && resultContent) {
    estimateButton.addEventListener('click', async () => {
        const description = projectDescription.value.trim();
        if (!description) {
            alert('Vui lòng nhập mô tả dự án của bạn.');
            return;
        }

        // Show loading state
        estimatorResult.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultContent.innerHTML = '';
        estimateButton.disabled = true;
        estimateButton.classList.add('opacity-50', 'cursor-not-allowed');

        const prompt = `Bạn là một chuyên gia tư vấn vật liệu xây dựng cho công ty sắt thép Nhật Thắng tại Vũng Tàu, Việt Nam. Nhiệm vụ của bạn là giúp khách hàng ước tính vật tư cần thiết cho dự án của họ dựa trên mô tả.

    Danh mục sản phẩm của chúng tôi bao gồm: Thép Tấm, Thép Hình (I, U, V, H), Thép Ống, Thép Hộp, Thép Láp, Inox, Lưới, và các loại Phụ Kiện.

    Dựa trên mô tả dự án sau đây từ khách hàng, hãy phân tích và đưa ra danh sách các vật liệu gợi ý.
    Mô tả dự án: "${description}"

    Vui lòng trả lời bằng tiếng Việt. Trình bày kết quả dưới dạng danh sách rõ ràng, có gạch đầu dòng hoặc đánh số. Với mỗi mục, hãy nêu rõ sản phẩm gợi ý, lý do ngắn gọn và số lượng ước tính. Nếu yêu cầu không rõ ràng, hãy hỏi thêm chi tiết để có thể tư vấn chính xác hơn. Luôn giữ thái độ thân thiện, hữu ích và chuyên nghiệp. Kết thúc câu trả lời bằng một lưu ý rằng đây chỉ là ước tính sơ bộ và khách hàng nên liên hệ trực tiếp để có báo giá chính xác.`;
        
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key is not needed for gemini-2.0-flash
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Error:", response.status, errorData);
                throw new Error(`API error! status: ${response.status}`);
            }

            const result = await response.json();
            
            let text = 'Đã có lỗi xảy ra, vui lòng thử lại.';
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                text = result.candidates[0].content.parts[0].text;
            }
            
            // Display result in a <pre> tag to preserve formatting safely
            const pre = document.createElement('pre');
            pre.textContent = text;
            resultContent.appendChild(pre);

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            resultContent.innerHTML = '<p class="text-red-500">Đã có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại sau.</p>';
        } finally {
            // Hide loading state
            loadingIndicator.style.display = 'none';
            estimateButton.disabled = false;
            estimateButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

    // --- MOBILE "SẢN PHẨM" DROPDOWN ---
    var toggleBtn = document.getElementById('mobile-product-toggle');
    var dropdown = document.getElementById('mobile-product-dropdown');
    var chevron = document.getElementById('mobile-product-chevron');
    if (toggleBtn && dropdown && chevron) {
        toggleBtn.addEventListener('click', function() {
            dropdown.classList.toggle('hidden');
            chevron.classList.toggle('fa-chevron-down');
            chevron.classList.toggle('fa-chevron-up');
            chevron.classList.toggle('rotate-180');
        });
    }

    // Một số trang dùng id khác cho nút dropdown sản phẩm mobile
    var mobileProductMenuBtn = document.getElementById('mobile-product-menu-btn');
    var mobileProductDropdown = document.getElementById('mobile-product-dropdown');
    if (mobileProductMenuBtn && mobileProductDropdown) {
        var chevron2 = mobileProductMenuBtn.querySelector('i.fas');
        mobileProductMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileProductDropdown.classList.toggle('hidden');
            if (chevron2) {
                chevron2.classList.toggle('fa-chevron-down');
                chevron2.classList.toggle('fa-chevron-up');
                chevron2.classList.toggle('rotate-180');
            }
        });
    }

    // --- SLIDER LOGIC ---
    function setupSlider(sliderClass, dotClass) {
        const slider = document.querySelector('.' + sliderClass);
        const dots = document.querySelectorAll('.' + dotClass);
        if (!slider || dots.length === 0) return;
        let idx = 0;
        const total = slider.children.length;
        function showSlide(i) {
            slider.style.transform = `translateX(-${i * 100}%)`;
            dots.forEach((d, j) => d.classList.toggle('bg-custom-blue', j === i));
        }
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                idx = i;
                showSlide(idx);
            });
        });
        showSlide(idx);
        setInterval(() => {
            idx = (idx + 1) % total;
            showSlide(idx);
        }, 3500);
    }
    // Các slider sản phẩm (tổng hợp từ các trang)
    setupSlider('theptamtron-slider', 'theptamtron-dot');
    setupSlider('theptamkem-slider', 'theptamkem-dot');
    setupSlider('theptamgan-slider', 'theptamgan-dot');
    setupSlider('thephinhh-slider', 'thephinhh-dot');
    setupSlider('thephinhi-slider', 'thephinhi-dot');
    setupSlider('thephinhv-slider', 'thephinhv-dot');
    setupSlider('thephinhu-slider', 'thephinhu-dot');
    setupSlider('thephopvuong-slider', 'thephopvuong-dot');
    setupSlider('thephopcn-slider', 'thephopcn-dot');
    setupSlider('thephopvuongkem-slider', 'thephopvuongkem-dot');
    setupSlider('thephopcnkem-slider', 'thephopcnkem-dot');
    setupSlider('theptrondac-slider', 'theptrondac-dot');
    setupSlider('thepvuongdac-slider', 'thepvuongdac-dot');
    setupSlider('theptronxaydung-slider', 'theptronxaydung-dot');
    setupSlider('thepong-slider', 'thepong-dot');
    setupSlider('thephanh-slider', 'thephanh-dot');
    setupSlider('ongkemduc-slider', 'ongkemduc-dot');
    setupSlider('ongkemhan-slider', 'ongkemhan-dot');
    setupSlider('co-slider', 'co-dot');
    setupSlider('te-slider', 'te-dot');
    setupSlider('bau-giam-slider', 'bau-giam-dot');
    setupSlider('chenhan-slider', 'chenhan-dot');
    setupSlider('matbich-slider', 'matbich-dot');
    setupSlider('mangsong-slider', 'mangsong-dot');
    setupSlider('vanthuyluc-slider', 'vanthuyluc-dot');
    setupSlider('roongapluc-slider', 'roongapluc-dot');
    setupSlider('khoaluoigrating-slider', 'khoaluoigrating-dot');
    setupSlider('mangtruot-slider', 'mangtruot-dot');
    setupSlider('banhxecualua-slider', 'banhxecualua-dot');
    setupSlider('chotcua-slider', 'chotcua-dot');
    setupSlider('banlecua-slider', 'banlecua-dot');
    setupSlider('luoib40-slider', 'luoib40-dot');
    setupSlider('luoihan-slider', 'luoihan-dot');
    setupSlider('luoikem-slider', 'luoikem-dot');
    setupSlider('onginox-slider', 'onginox-dot');
    setupSlider('hopinox-slider', 'hopinox-dot');
    setupSlider('taminox-slider', 'taminox-dot');
    setupSlider('cut-slider', 'cut-dot');

    // --- POPUP ESTIMATOR LOGIC (nếu có trên trang) ---
    var popup = document.getElementById('popup-estimator');
    var closePopupBtn = document.getElementById('close-popup');
    if (popup && closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            popup.classList.add('hidden');
        });
    }
    // Nếu muốn mở popup từ nút nào đó, thêm logic tại đây (ví dụ: document.getElementById('open-popup').addEventListener...)

    // --- THÊM LOGIC KHÁC NẾU CẦN ---
    // ...existing code...
});
