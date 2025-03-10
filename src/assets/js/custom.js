  
    document.addEventListener('DOMContentLoaded', function() {
        // Toggle Sidebar
        const toggleBtn = document.querySelector('.toggle-sidebar');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
        
        // Toggle Sidebar Submenu
        const sidebarMenuItems = document.querySelectorAll('.sidebar .has-submenu');
        
        sidebarMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle submenu visibility
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('active');
                
                // Toggle chevron icon
                const chevron = this.querySelector('.submenu-toggle');
                chevron.classList.toggle('fa-chevron-down');
                chevron.classList.toggle('fa-chevron-up');
            });
        });
        
        // Initialize all Bootstrap dropdowns
        var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
        var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl)
        });
        
        // Handle responsive layout
        function handleResponsiveLayout() {
            if (window.innerWidth < 992) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                // Only reset if it was collapsed due to responsive layout
                if (window.innerWidth > 992 && window.previousWidth < 992) {
                    sidebar.classList.remove('collapsed');
                    mainContent.classList.remove('expanded');
                }
            }
            window.previousWidth = window.innerWidth;
        }
        
        // Initial check and add resize listener
        window.previousWidth = window.innerWidth;
        handleResponsiveLayout();
        window.addEventListener('resize', handleResponsiveLayout);
    });