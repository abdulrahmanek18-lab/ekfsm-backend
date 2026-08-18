  async saveCompany(data: any) {
    const existing = await this.prisma.company.findFirst();
    
    // This object ensures all image fields are passed to Prisma
    const saveData = {
      name: data.name,
      trn: data.trn,
      phone: data.phone,
      email: data.email,
      address: data.address,
      vatPercent: parseFloat(data.vatPercent) || 5,
      invoicePrefix: data.invoicePrefix,
      poPrefix: data.poPrefix,
      woPrefix: data.woPrefix,
      // Image fields:
      logoUrl: data.logoUrl,
      invoiceHeader: data.invoiceHeader,
      invoiceFooter: data.invoiceFooter,
      authorizedSignatureUrl: data.authorizedSignatureUrl,
      companySealUrl: data.companySealUrl,
    };
    
    if (existing) {
      return this.prisma.company.update({
        where: { id: existing.id },
        data: saveData,
      });
    }
    
    return this.prisma.company.create({
      data: saveData,
    });
  }
