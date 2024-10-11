async function getCategoryAndSubCategory(subCategoryId, language) {
    try {
        const subCategoriesResponse = await fetch(`${API_HOST}${language}_sub_categories/${subCategoryId}`);
        const subCategory = await subCategoriesResponse.json();

        const categoriesResponse = await fetch(`${API_HOST}${language}_categories/${subCategory.category_id}`);
        const category = await categoriesResponse.json();
        return {
            sub_category_id: subCategory.id,
            category_id: category.id
        };
    } catch (error) {
        console.error("Error fetching category and sub-category:", error);
    }
}
