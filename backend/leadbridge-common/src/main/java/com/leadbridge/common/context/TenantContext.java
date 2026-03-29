package com.leadbridge.common.context;

public class TenantContext {

    private static final ThreadLocal<String> CURRENT_ROLE = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_MSSP = new ThreadLocal<>();

    public static void set(String role, String tenantId, String msspId) {
        CURRENT_ROLE.set(role);
        CURRENT_TENANT.set(tenantId);
        CURRENT_MSSP.set(msspId);
    }

    public static String getRole() {
        return CURRENT_ROLE.get();
    }

    public static String getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static String getMsspId() {
        return CURRENT_MSSP.get();
    }

    public static void setTenantId(String tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static void clear() {
        CURRENT_ROLE.remove();
        CURRENT_TENANT.remove();
        CURRENT_MSSP.remove();
    }
}
